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

using System.Reactive.Linq;
using HotChocolate.Subscriptions;

namespace Energinet.DataHub.WebApi.GraphQL.Subscription;

public partial class Subscription
{
    public IObservable<Notification> OnNotificationAddedAsync(
        [Service] ITopicEventReceiver eventReceiver,
        CancellationToken cancellationToken)
    {
        var delayed = new List<Notification>
        {
            new("BalanceResponsibilityActorUnrecognized", "123", new DateTimeOffset(2024, 10, 11, 14, 0, 0, TimeSpan.Zero), new DateTimeOffset(2024, 10, 11, 14, 0, 0, TimeSpan.Zero)),
        }
        .ToObservable()
        .Delay(TimeSpan.FromSeconds(30));

        return new List<Notification>
        {
            new("BalanceResponsibilityActorUnrecognized", "123", new DateTimeOffset(2024, 10, 10, 12, 0, 0, TimeSpan.Zero), new DateTimeOffset(2024, 10, 10, 12, 0, 0, TimeSpan.Zero)),
            new("BalanceResponsibilityValidationFailed", "123", new DateTimeOffset(2024, 10, 9, 12, 0, 0, TimeSpan.Zero), new DateTimeOffset(2024, 10, 9, 12, 0, 0, TimeSpan.Zero)),
            new("ActorClientSecretExpiresSoon", "123", new DateTimeOffset(2024, 10, 8, 12, 0, 0, TimeSpan.Zero), new DateTimeOffset(2024, 10, 8, 12, 0, 0, TimeSpan.Zero)),
            new("OrganizationIdentityUpdated", "123", new DateTimeOffset(2024, 10, 8, 2, 0, 0, TimeSpan.Zero), new DateTimeOffset(2024, 10, 8, 2, 0, 0, TimeSpan.Zero)),
        }.ToObservable()
        .Concat(delayed)
        .Concat(Observable.Never<Notification>());
    }

    [Subscribe(With = nameof(OnNotificationAddedAsync))]
    public Notification NotificationAdded([EventMessage] Notification notification) =>
        notification;
}
