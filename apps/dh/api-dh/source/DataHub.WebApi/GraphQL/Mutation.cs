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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using HotChocolate;
using HotChocolate.Types;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class Mutation
    {
        [UseMutationConvention(Disable = true)]
        public Task<PermissionDetailsDto> UpdatePermissionAsync(
            UpdatePermissionDto input,
            [Service] IMarketParticipantPermissionsClient client) =>
            client
                .UpdatePermissionAsync(input)
                .Then(() => client.GetPermissionAsync(input.Id));

        public Task<BatchDto> CreateCalculationAsync(
            Interval period,
            string[] gridAreaCodes,
            ProcessType processType,
            [Service] IWholesaleClient_V3 client)
            {
                if (!period.HasEnd || !period.HasStart)
                {
                    throw new Exception("Period cannot be open-ended");
                }

                var batchRequestDto = new BatchRequestDto
                {
                    StartDate = period.Start.ToDateTimeOffset(),
                    EndDate = period.End.ToDateTimeOffset(),
                    GridAreaCodes = gridAreaCodes,
                    ProcessType = processType,
                };

                return client
                    .CreateBatchAsync(batchRequestDto)
                    .Then(batchId => new BatchDto
                    {
                        BatchId = batchId,
                        ExecutionState = BatchState.Pending,
                        PeriodStart = batchRequestDto.StartDate,
                        PeriodEnd = batchRequestDto.EndDate,
                        ExecutionTimeEnd = null,
                        ExecutionTimeStart = null,
                        AreSettlementReportsCreated = false,
                        GridAreaCodes = gridAreaCodes,
                        ProcessType = processType,
                    });
            }
    }
}