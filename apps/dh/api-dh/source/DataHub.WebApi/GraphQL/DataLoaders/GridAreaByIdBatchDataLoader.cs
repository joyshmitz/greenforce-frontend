﻿// Copyright 2020 Energinet DataHub A/S
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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using GreenDonut;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class GridAreaByIdBatchDataLoader : BatchDataLoader<Guid, GridAreaDto>
    {
        private readonly IMarketParticipantClient _client;

        public GridAreaByIdBatchDataLoader(
            IMarketParticipantClient client,
            IBatchScheduler batchScheduler,
            DataLoaderOptions? options = null)
            : base(batchScheduler, options) =>
            _client = client;

        protected override async Task<IReadOnlyDictionary<Guid, GridAreaDto>> LoadBatchAsync(
            IReadOnlyList<Guid> keys,
            CancellationToken cancellationToken) =>
            (await _client.GetGridAreasAsync()).ToDictionary(x => x.Id);
    }
}