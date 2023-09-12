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

using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using HotChocolate.Types;
using NodaTime;

namespace Energinet.DataHub.WebApi.Choco
{
    public class CalculationType : ObjectType<BatchDto>
    {
        protected override void Configure(IObjectTypeDescriptor<BatchDto> descriptor)
        {
            descriptor
                .Name("Calculation")
                .Description("An immutable calculation.");

            descriptor
                .Field(x => x.BatchId)
                .Name("id");

            descriptor
                .Ignore(x => x.PeriodStart)
                .Ignore(x => x.PeriodEnd)
                .Field(f => new Interval(Instant.FromDateTimeOffset(f.PeriodStart), Instant.FromDateTimeOffset(f.PeriodEnd)))
                .Name("period");

            descriptor
                .Field(f => f.CreatedByUserId)
                .Name("createdByUserName")
                .ResolveWith<WholesaleResolvers>(c => c.GetCreatedByUserNameAsync(default!, default!));

            descriptor
               .Field(f => f.GridAreaCodes)
               .Name("gridAreas")
               .ResolveWith<WholesaleResolvers>(c => c.GetGridAreasAsync(default!, default!));

            descriptor
                .Field("statusType")
                .Type<StatusType>()
                .Resolve(context => context.Parent<BatchDto>().ExecutionState switch
                {
                    BatchState.Pending => "warning",
                    BatchState.Completed => "success",
                    BatchState.Failed => "danger",
                    BatchState.Executing => "info",
                    _ => "info",
                });
        }
    }
}
