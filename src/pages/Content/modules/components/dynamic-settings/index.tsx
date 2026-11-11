import React from 'react';
import ReactDOM from 'react-dom';
import DynamicSettings from './DynamicSettings';
import { Options } from '../../types';

/*
  render app function
*/

export default function runSettings(
  container: HTMLElement,
  data: Options
): void {
  ReactDOM.render(
    <React.StrictMode>
      <DynamicSettings options={data} />
    </React.StrictMode>,
    container
  );
  console.log(
    'Due This Week: Check out the repo! https://github.com/samfrazier/due-this-week'
  );
}
