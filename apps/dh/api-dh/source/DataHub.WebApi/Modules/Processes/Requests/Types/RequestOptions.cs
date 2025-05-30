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

using System.Security.Claims;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Common.Types;
using Energinet.DataHub.WebApi.Modules.Processes.Requests.Models;
using EicFunction = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1.EicFunction;

namespace Energinet.DataHub.WebApi.Modules.Processes.Requests.Types;

public class RequestOptions(ClaimsPrincipal user, EicFunction marketRole)
{
    public IEnumerable<Option<RequestCalculationType>> GetCalculationTypes()
    {
        var calculationTypes = new List<Option<RequestCalculationType>>();

        if (user.HasRole("request-aggregated-measured-data:view"))
        {
            calculationTypes.Add(new(RequestCalculationType.Aggregation));
            calculationTypes.Add(new(RequestCalculationType.BalanceFixing));
        }

        if (user.HasRole("request-wholesale-settlement:view"))
        {
            calculationTypes.Add(new(RequestCalculationType.WholesaleFixing));
            calculationTypes.Add(new(RequestCalculationType.FirstCorrection));
            calculationTypes.Add(new(RequestCalculationType.SecondCorrection));
            calculationTypes.Add(new(RequestCalculationType.ThirdCorrection));
        }

        return calculationTypes;
    }

    public IEnumerable<Option<MeteringPointType>> GetMeteringPointTypes()
    {
        var meteringPointTypes = new List<Option<MeteringPointType>>
        {
            new(MeteringPointType.All),
            new(MeteringPointType.FlexConsumption),
            new(MeteringPointType.NonProfiledConsumption),
            new(MeteringPointType.Production),
        };

        if (marketRole != EicFunction.BalanceResponsibleParty && marketRole != EicFunction.EnergySupplier)
        {
            meteringPointTypes.Add(new(MeteringPointType.Exchange));
            meteringPointTypes.Add(new(MeteringPointType.TotalConsumption));
        }

        return meteringPointTypes;
    }

    public bool GetIsGridAreaRequired() => marketRole == EicFunction.GridAccessProvider;
}
