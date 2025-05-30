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

using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.CustomQueries.Calculations.V1.Model;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.Processes.Calculations.Types;

[ObjectType<CapacitySettlementCalculationResultV1>]
public static partial class CapacitySettlementCalculationNode
{
    public static YearMonth YearMonth([Parent] CapacitySettlementCalculationResultV1 f) =>
        new YearMonth((int)f.ParameterValue.Year, (int)f.ParameterValue.Month);

    static partial void Configure(
        IObjectTypeDescriptor<CapacitySettlementCalculationResultV1> descriptor)
    {
        descriptor
            .Name("CapacitySettlementCalculation")
            .BindFieldsExplicitly()
            .Implements<CalculationInterfaceType>();
    }
}
