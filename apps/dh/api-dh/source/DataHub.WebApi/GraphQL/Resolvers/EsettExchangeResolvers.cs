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

using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class EsettExchangeResolvers
    {
        public Task<GridAreaDto> GetGridAreaAsync(
            [Parent] ExchangeEventTrackingResult result,
            GridAreaByCodeBatchDataLoader dataLoader) =>
            dataLoader.LoadAsync(result.GridAreaCode);

        public string? GetDocumentLink(
            string action,
            [Parent] ExchangeEventTrackingResult result,
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] LinkGenerator linkGenerator) =>
                linkGenerator.GetUriByAction(
                    httpContextAccessor.HttpContext!,
                    action,
                    "EsettExchange",
                    new { documentId = result.DocumentId });
    }
}