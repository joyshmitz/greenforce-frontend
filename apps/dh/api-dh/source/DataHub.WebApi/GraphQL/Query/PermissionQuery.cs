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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.GraphQL;

public partial class Query
{
    public async Task<PermissionDto> GetPermissionByIdAsync(
        int id,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.PermissionGetAsync(id);

    public async Task<IEnumerable<PermissionDto>> GetPermissionsAsync(
        string searchTerm,
        [Service] IMarketParticipantClient_V1 client) =>
        (await client.PermissionGetAsync())
            .Where(p =>
                searchTerm is null ||
                p.Name.Contains(searchTerm, StringComparison.CurrentCultureIgnoreCase) ||
                p.Description.Contains(searchTerm, StringComparison.CurrentCultureIgnoreCase));

    public async Task<IEnumerable<PermissionAuditedChangeAuditLogDto>> GetPermissionAuditLogsAsync(
        int id,
        [Service] IMarketParticipantClient_V1 client) =>
        await client.PermissionAuditAsync(id);
}
