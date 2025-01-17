// Copyright 2020 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License2");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.GraphQL.DataLoaders;

public class ConsolidationByGridAreaIdBatchDataLoader : BatchDataLoader<string, ActorConsolidationDto?>
{
    private readonly IMarketParticipantClient_V1 _client;

    public ConsolidationByGridAreaIdBatchDataLoader(
        IMarketParticipantClient_V1 client,
        IBatchScheduler batchScheduler,
        DataLoaderOptions options)
        : base(batchScheduler, options) =>
        _client = client;

    protected override async Task<IReadOnlyDictionary<string, ActorConsolidationDto?>> LoadBatchAsync(
        IReadOnlyList<string> keys,
        CancellationToken cancellationToken)
        {
            var gridAreas = (await _client.GridAreaGetAsync(cancellationToken))
                .Where(x => keys.Contains(x.Code))
                .Select(x => (x.Id, x.Code))
                .ToDictionary();

            var actors = (await _client
                .ActorGetAsync(cancellationToken))
                .Where(x => x.MarketRole.GridAreas.Any(y => gridAreas.ContainsKey(y.Id)) && x.MarketRole.EicFunction == EicFunction.GridAccessProvider);

            var consolidations = (await _client.ActorConsolidationsAsync(cancellationToken)).ActorConsolidations;

            var returnDict = new Dictionary<string, ActorConsolidationDto?>();
            foreach (var gridArea in gridAreas)
            {
                var actor = actors.FirstOrDefault(x => x.MarketRole.GridAreas.Any(x => x.Id == gridArea.Key));
                if (actor is null)
                {
                    returnDict.Add(gridArea.Value, null);
                    continue;
                }

                var consolidation = consolidations.FirstOrDefault(x => x.ActorFromId == actor.ActorId);
                returnDict.Add(gridArea.Value, consolidation);
            }

            return returnDict;
        }
}
