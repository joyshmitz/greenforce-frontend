/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'eo-landing-page-how',
  imports: [NgClass],
  encapsulation: ViewEncapsulation.None,
  styles: `
    eo-landing-page-how {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #02525E;
      color: #fff;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 28px;
      padding: 0 24px 96px 24px;
      --transition: all 1500ms cubic-bezier(.75, 0, .25, 1);
      --scale: scale(1.15766, 1);
      container: eo-landing-page-how / inline-size;

      h3 {
        color: #FFF;
        text-align: center;
        font-size: 32px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }

      h2 {
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: 0.54px;
      }

      h2, h3 {
        text-transform: uppercase;
      }

      .highlight {
        color: #13ECB8;
      }

      .heading {
        position: relative;
        z-index: 1;
        border-radius: 32px;
        min-width: calc(100vw + 64px);
        min-height: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('/assets/landing-page/Rectangle 12 transformed.avif') no-repeat;
        background-size: cover;
        flex-direction: column;
        gap: 24px;
      }

      .text-container {
        display: flex;
        flex-direction: column;
        margin-top: 48px;
        gap: 16px;
      }
    }

    @container eo-landing-page-how (min-width: 1150px) {
      eo-landing-page-how {
        min-height: 1100px;
        padding: 150px 0;

        * {
          max-width: 888px;
        }

        h3 {
          font-size: 62px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          text-align: left;
          transition: var(--transition);
        }

        h2 {
          transform: translate3d(0, -200%, 0);
        }

        .heading {
          min-height: 570px;
          min-width: 888px;
          margin-top: 208px;
          transition: var(--transition);
          background: url('/assets/landing-page/Rectangle 12.avif') no-repeat;
          align-items: flex-start;
          justify-content: flex-start;

          &.active {
            background: url('/assets/landing-page/Rectangle 12 transformed.avif') no-repeat;
            min-width: 1028px;
            min-height: 790px;

            h3 {
              transform: translate3d(9%, 75%, 0);
            }
          }
        }

        .text-container {
          display: flex;
          gap: 46px;
          margin-top: 80px;
          z-index: 1;
          transition: var(--transition);
          flex-direction: row;

          &.active {
            transform: translate3d(0, -200%, 0);
          }
        }
      }
    }
  `,
  template: `
    <div class="heading" [ngClass]="{ active: isActive() }">
      <h2 class="highlight">how we make sustainability reporting easier</h2>
      <h3>
        Fast-Track Compliance<br/> with <span class="highlight">EU Sustainability</span
        ><br />Regulations
      </h3>
    </div>


    <section class="text-container" [ngClass]="{ active: isActive() }">
      <p>
        Energy Origin emerges as a transformative solution designed to guide companies through the
        complexities of adhering to the EU's Corporate Sustainability Reporting Directive (CSRD)
        and Environmental, Social, and Governance (ESG) directives.
      </p>
      <p>
        By leveraging advanced blockchain technology to provide unassailable traceability of
        sustainable energy back to its source, Energy Origin offers businesses a robust tool to
        validate their green energy commitments.
      </p>
    </section>
  `,
})
export class EoLandingPageHowComponent implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;
  private elementRef = inject(ElementRef);
  protected isActive = signal<boolean>(false);

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && this.isActive() === false) {
            this.isActive.set(true);
          } else if(!entry.isIntersecting && this.isActive() === true) {
            this.isActive.set(false);
          }
        });
      },
      { threshold: 0.4 }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
