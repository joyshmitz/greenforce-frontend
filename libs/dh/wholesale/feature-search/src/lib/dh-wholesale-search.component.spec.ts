import { HttpClientModule } from '@angular/common/http';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { WattDanishDatetimeModule } from '@energinet-datahub/watt';

import {
  DhWholesaleSearchComponent,
  DhWholesaleSearchScam,
} from './dh-wholesale-search.component';

async function setup() {
  await render(DhWholesaleSearchComponent, {
    imports: [
      WattDanishDatetimeModule.forRoot(),
      DhWholesaleSearchScam,
      HttpClientModule,
      getTranslocoTestingModule(),
      DhApiModule.forRoot(),
    ],
  });
}

describe(DhWholesaleSearchComponent.name, () => {
  it('should show period with initial value', async () => {
    await setup();
    expect(screen.getByText('Period')).toBeInTheDocument();
  });

  it('should set initial value of period', async () => {
    await setup();

    const startDateInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /start-date-input/i,
    });
    const endDateInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /end-date-input/i,
    });

    expect(startDateInput.value).not.toBe('');
    expect(endDateInput.value).not.toBe('');
  });

  it('should show search button', async () => {
    await setup();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('should search batches on init', async() => {
    await setup();
    expect(screen.queryByRole('progressbar')).toBeInTheDocument();
  });

  it('should show loading indicator when starting a new search of batches', async () => {
    await setup();
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));
    userEvent.click(screen.getByText('Search'));
    expect(screen.queryByRole('progressbar')).toBeInTheDocument();
  });
});
