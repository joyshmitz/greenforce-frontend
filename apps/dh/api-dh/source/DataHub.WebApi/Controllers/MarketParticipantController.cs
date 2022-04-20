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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]/organization")]
    public class MarketParticipantController : ControllerBase
    {
        private readonly IMarketParticipantClient _client;

        public MarketParticipantController(IMarketParticipantClient client)
        {
            _client = client;
        }

        /// <summary>
        /// Retrieves all organizations
        /// </summary>
        [HttpGet]
        public Task<ActionResult<IEnumerable<OrganizationDto>>> GetAllOrganizationsAsync()
        {
            return HandleExceptionAsync(() => _client.GetOrganizationsAsync());
        }

        /// <summary>
        /// Retrieves a single organization
        /// </summary>
        [HttpGet("{orgId:guid}/")]
        public Task<ActionResult<OrganizationDto>> GetOrganizationAsync(Guid orgId)
        {
            return HandleExceptionAsync(() => _client.GetOrganizationAsync(orgId));
        }

        /// <summary>
        /// Creates an organization
        /// </summary>
        [HttpPost]
        public Task<ActionResult<Guid>> CreateOrganizationAsync(ChangeOrganizationDto organizationDto)
        {
            return HandleExceptionAsync(() => _client.CreateOrganizationAsync(organizationDto));
        }

        /// <summary>
        /// Updates an organization
        /// </summary>
        [HttpPut]
        public Task<ActionResult> UpdateOrganizationAsync(Guid orgId, ChangeOrganizationDto organizationDto)
        {
            return HandleExceptionAsync(() => _client.UpdateOrganizationAsync(orgId, organizationDto));
        }

        /// <summary>
        /// Retrieves all actors to a single organization
        /// </summary>
        [HttpGet("{orgId:guid}/actor")]
        public Task<ActionResult<IEnumerable<ActorDto>>> GetActorsAsync(Guid orgId)
        {
            return HandleExceptionAsync(() => _client.GetActorsAsync(orgId));
        }

        /// <summary>
        /// Retrieves a single actor to a specific organization
        /// </summary>
        [HttpGet("{orgId:guid}/actor/{actorId:guid}")]
        public Task<ActionResult<ActorDto>> GetActorAsync(Guid orgId, Guid actorId)
        {
            return HandleExceptionAsync(() => _client.GetActorAsync(orgId, actorId));
        }

        /// <summary>
        /// Updates an Actor in an organization
        /// </summary>
        [HttpPost("{orgId:guid}/actor")]
        public Task<ActionResult<Guid>> CreateActorAsync(Guid orgId, CreateActorDto actorDto)
        {
            return HandleExceptionAsync(() => _client.CreateActorAsync(orgId, actorDto));
        }

        /// <summary>
        /// Updates an Actor in an organization
        /// </summary>
        [HttpPut("{orgId:guid}/actor/{actorId:guid}")]
        public Task<ActionResult> UpdateActorAsync(Guid orgId, Guid actorId, ChangeActorDto actorDto)
        {
            return HandleExceptionAsync(() => _client.UpdateActorAsync(orgId, actorId, actorDto));
        }

        /// <summary>
        /// Gets all the contacts in an organization.
        /// </summary>
        [HttpGet("{orgId:guid}/contact")]
        public Task<ActionResult<IEnumerable<ContactDto>>> GetContactsAsync(Guid orgId)
        {
            return HandleExceptionAsync(() => _client.GetContactsAsync(orgId));
        }

        /// <summary>
        /// Creates a contact in an organization.
        /// </summary>
        [HttpPost("{orgId:guid}/contact")]
        public Task<ActionResult<Guid>> CreateContactAsync(Guid orgId, CreateContactDto createDto)
        {
            return HandleExceptionAsync(() => _client.CreateContactAsync(orgId, createDto));
        }

        /// <summary>
        /// Removes a contact from an organization.
        /// </summary>
        [HttpDelete("{orgId:guid}/contact/{contactId:guid}")]
        public Task<ActionResult> DeleteContactAsync(Guid orgId, Guid contactId)
        {
            return HandleExceptionAsync(() => _client.DeleteContactAsync(orgId, contactId));
        }

        private async Task<ActionResult<T>> HandleExceptionAsync<T>(Func<Task<T>> func)
        {
            try
            {
                return Ok(await func().ConfigureAwait(false));
            }
            catch (MarketParticipantException e)
            {
                return StatusCode(e.StatusCode, e.Message);
            }
        }

        private async Task<ActionResult> HandleExceptionAsync(Func<Task> func)
        {
            try
            {
                await func().ConfigureAwait(false);
                return Ok();
            }
            catch (MarketParticipantException e)
            {
                return StatusCode(e.StatusCode, e.Message);
            }
        }
    }
}
