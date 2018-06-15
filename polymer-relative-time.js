import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `polymer-relative-time`
 * displays relative time
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class PolymerRelativeTime extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      [[_output]]
    `;
  }
  static get properties() {
    return {
      _output: {
        type: String,
        computed: '_computeOutput(timestamp, _currentTimestamp)',
        readOnly: true
      },
      timestamp: {
        type: Number,
        value: () => (Date.now()),
        observer: '_timestampChanged'
      },
      _currentTimestamp: {
        type: Number,
        value: () => (Date.now())
      },
      updateInterval: {
        type: Number,
        value: 1,
        observer: '_updateIntervalChanged'

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

    switch(true) {
      case (absDiff<10): 
        return 'now';
      case (absDiff<60): 
        return 'few seconds' + suffix;
      case (absDiff<60*60): 
        if(Math.floor(absDiff/60) == 1)
          return "a minute" + suffix;
        return Math.floor(absDiff/60) + ' minutes' + suffix;
      case (absDiff<day): 
        if(Math.floor(absDiff/3600) == 1)
          return "an hour" + suffix;
        return Math.floor(absDiff/3600) + ' hours' + suffix;
      case (absDiff<week):
        if(Math.floor(absDiff/day) == 1)
          return "a day" + suffix; 
        return Math.floor(absDiff/day) + ' days' + suffix;
      case (absDiff<month): 
        if(Math.floor(absDiff/week) == 1)
          return "a week" + suffix; 
        return Math.floor(absDiff/week) + ' weeks' + suffix;
      case (absDiff<year): 
        if(Math.floor(absDiff/month) == 1)
          return "a month" + suffix; 
        return Math.floor(absDiff/month) + ' months' + suffix;
      default: 
        if(Math.floor(absDiff/year) == 1)
          return "an year" + suffix; 
        return Math.floor(absDiff/year) + ' years' + suffix;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.interval = setInterval(() => {this.set('_currentTimestamp', Date.now())}, 1000);
  }

  disconnectedCallback() {
    this.disconnectedCallback();
    if(this.interval)
      clearInterval(this.interval);
  }

  _timestampChanged(n, o) {
    this.set('_currentTimestamp', Date.now() +1);  //this hack makes sure the _currentTimestamp is atleast 1ms ahead of given timestamp;
    this.notifyPath('_currentTimestamp');
  }

  _updateIntervalChanged(n, o) {

    this.set('_currentTimestamp', Date.now());
    if(this.interval)
      clearInterval(this.interval);
    this.interval = setInterval(() => {this.set('_currentTimestamp', Date.now())}, (1000 * n));
  }
}

window.customElements.define('polymer-relative-time', PolymerRelativeTime);
