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
using Energinet.DataHub.Core.App.Common.Diagnostics.HealthChecks;
using Microsoft.Extensions.DependencyInjection;

namespace Energinet.DataHub.WebApi.Registration
{
    public static class HealthEndpointRegistrationExtensions
    {
        public static IServiceCollection SetupHealthEndpoints(this IServiceCollection services, ApiClientSettings apiClientSettingsService)
        {
            services
                .AddHealthChecks()
                .AddLiveCheck()
                .AddServiceHealthCheck("marketParticipant", CreateHealthEndpointUri(apiClientSettingsService.MarketParticipantBaseUrl))
                .AddServiceHealthCheck("wholesale", CreateHealthEndpointUri(apiClientSettingsService.WholesaleBaseUrl))
                .AddServiceHealthCheck("eSettExchange", CreateHealthEndpointUri(apiClientSettingsService.ESettExchangeBaseUrl));

            return services;
        }

        private static Uri CreateHealthEndpointUri(string baseUri)
        {
            return string.IsNullOrWhiteSpace(baseUri)
                ? throw new ArgumentException("Invalid baseUri", nameof(baseUri))
                : new Uri(baseUri + "/monitor/live");
        }
    }
}
