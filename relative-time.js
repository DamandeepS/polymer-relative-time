import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `relative-time`
 * displays relative time
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class RelativeTime extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>[[output]]!</h2>
    `;
  }
  static get properties() {
    return {
      output: {
        type: String,
        computed: '_computeOutput(timestamp, currentTimestamp)'
      },
      timestamp: {
        type: Number
      },
      currentTimestamp: {
        type: Number,
        value: () => (Date.now())
      }
    };
  }

  _computeOutput(t,c) {
    const diff = (c - t)/1000;
    if(isNaN(diff))
      return;
    const suffix = diff>0?' ago':' left',
          absDiff = Math.abs(diff),
          day = 60*60*24,
          week = day*7,
          month = day*30,
          year = day*365;
      if(absDiff<60)
        return 'few seconds' + suffix;
      else if(absDiff<3600 && absDiff >60)
        return Math.floor(absDiff/60) + ' minute(s)' + suffix;
      else if(absDiff<day&&absDiff>(60*60))
        return Math.floor(absDiff/3600) + ' hour(s)' + suffix;
      else if(absDiff<week&&absDiff>day)
        return Math.floor(absDiff/day) + ' day(s)' + suffix;
      else if(absDiff<month&&absDiff>week)
        return Math.floor(absDiff/week) + ' week(s)' + suffix;
      else if(absDiff<year&&absDiff>month)
        return Math.floor(absDiff/month) + ' month(s)' + suffix;
      else return Math.floor(absDiff/year) + ' year(s)' + suffix;
  }

  connectedCallback() {
    super.connectedCallback();
    this.interval = setInterval(() => {this.set('currentTimestamp', Date.now())}, 10000);
  }

  disconnectedCallback() {
    this.disconnectedCallback();
    clearInterval(this.interval)
  }
}

window.customElements.define('relative-time', RelativeTime);
