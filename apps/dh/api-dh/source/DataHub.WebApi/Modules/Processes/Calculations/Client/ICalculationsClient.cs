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
using Energinet.DataHub.WebApi.Modules.Common.Models;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Models;

namespace Energinet.DataHub.WebApi.Modules.Processes.Calculations.Client;

/// <summary>
/// Client for interacting with calculations in the Process Manager.
/// </summary>
public interface ICalculationsClient
{
    /// <summary>
    /// Query calculations in the Process Manager.
    /// </summary>
    Task<IEnumerable<ICalculationsQueryResultV1>> QueryCalculationsAsync(
        CalculationsQueryInput input,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get latest calculation within a given period from the Process Manager.
    /// </summary>
    Task<ICalculationsQueryResultV1?> GetLatestCalculationAsync(
        StartCalculationType startCalculationType,
        PeriodInput period,
        CancellationToken ct = default);

    /// <summary>
    /// Get calculation from the Process Manager.
    /// </summary>
    Task<ICalculationsQueryResultV1?> GetCalculationByIdAsync(
        Guid calculationId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Start or schedule calculation in the Process Manager.
    /// </summary>
    Task<Guid> StartCalculationAsync(
        CreateCalculationInput input,
        CancellationToken ct = default);

    /// <summary>
    /// Cancel a scheduled calculation in the Process Manager.
    /// </summary>
    Task<bool> CancelScheduledCalculationAsync(
        Guid calculationId,
        CancellationToken ct = default);

    /// <summary>
    /// Get all non-terminated calculations in the Process Manager.
    /// </summary>
    Task<IEnumerable<ICalculationsQueryResultV1>> GetNonTerminatedCalculationsAsync(
        CancellationToken ct = default);
}
