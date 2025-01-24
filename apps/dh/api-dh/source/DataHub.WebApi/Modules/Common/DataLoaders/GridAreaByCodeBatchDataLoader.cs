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
using Energinet.DataHub.WebApi.GraphQL.Extensions;

namespace Energinet.DataHub.WebApi.Modules.Common.DataLoaders;

public class GridAreaByCodeBatchDataLoader(
    IMarketParticipantClient_V1 client,
    IBatchScheduler batchScheduler,
    DataLoaderOptions options)
    : BatchDataLoader<string, GridAreaDto>(batchScheduler, options)
{
    protected override async Task<IReadOnlyDictionary<string, GridAreaDto>> LoadBatchAsync(
        IReadOnlyList<string> keys,
        CancellationToken cancellationToken)
    {
        var gridAreas = await client.GetGridAreasAsync(cancellationToken);
        return gridAreas
            .Select(g => new KeyValuePair<string, GridAreaDto>(g.Code, g))
            .ToDictionary();
    }
}
