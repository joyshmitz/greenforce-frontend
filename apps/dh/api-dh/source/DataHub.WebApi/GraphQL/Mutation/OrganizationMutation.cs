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

namespace Energinet.DataHub.WebApi.GraphQL.Mutation;

public partial class Mutation
{
    [Error(typeof(ApiException))]
    public async Task<bool> UpdateOrganizationAsync(
        Guid orgId,
        string domain,
        [Service] IMarketParticipantClient_V1 client)
    {
        var organization = await client.OrganizationGetAsync(orgId).ConfigureAwait(false);
        if (!string.Equals(organization.Domain, domain, StringComparison.Ordinal))
        {
            var changes = new ChangeOrganizationDto()
            {
                Name = organization.Name,
                Domain = domain,
                Status = organization.Status,
            };

            await client.OrganizationPutAsync(orgId, changes).ConfigureAwait(false);
        }

        return true;
    }
}
