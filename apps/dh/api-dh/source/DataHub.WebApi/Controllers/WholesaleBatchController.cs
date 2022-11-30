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
using System.IO;
using System.Net.Mime;
using System.Threading.Tasks;
using Energinet.DataHub.Wholesale.Client;
using Energinet.DataHub.Wholesale.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class WholesaleBatchController : ControllerBase
    {
        private readonly IWholesaleClient _client;

        public WholesaleBatchController(IWholesaleClient client)
        {
            _client = client;
        }

        /// <summary>
        /// Create a batch.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult> CreateAsync(BatchRequestDto batchRequestDto)
        {
            await _client.CreateBatchAsync(batchRequestDto).ConfigureAwait(false);
            return Ok();
        }

        /// <summary>
        /// Get a batch.
        /// </summary>
        [HttpPost("Search")]
        public async Task<ActionResult<IEnumerable<BatchDtoV2>>> PostAsync(BatchSearchDto batchSearchDto)
        {
            var batches = await _client.GetBatchesAsync(batchSearchDto).ConfigureAwait(false);
            return Ok(batches);
        }

        /// <summary>
        /// Get a batch.
        /// </summary>
        [HttpGet("ZippedBasisDataStream")]
        [Produces("application/zip")]
        public async Task<ActionResult<Stream>> GetAsync(Guid batchId)
        {
            var stream = await _client.GetZippedBasisDataStreamAsync(batchId);
            return File(stream, MediaTypeNames.Application.Zip);
        }

        /// <summary>
        /// Get a batch.
        /// </summary>
        [HttpGet("Batch")]
        public async Task<ActionResult<BatchDtoV2?>> GetBatchAsync(Guid batchId)
        {
            var batchDto = await _client.GetBatchAsync(batchId);
            return batchDto;
        }

        /// <summary>
        /// Get a processStepResult.
        /// </summary>
        [HttpPost("ProcessStepResult")]
        public async Task<ActionResult> GetAsync(ProcessStepResultRequestDto processStepResultRequestDto)
        {
            var dto = await _client.GetProcessStepResultAsync(processStepResultRequestDto).ConfigureAwait(false);
            return await Task.FromResult<ActionResult>(Ok(dto));
        }
    }
}
