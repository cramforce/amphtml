/**
 * Copyright 2016 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// There can be multiple instances of this modules :(
const initialized = !!window.AMP_TASKS;
const tasks = window.AMP_TASKS = window.AMP_TASKS ? window.AMP_TASKS : [];

const shouldNotUseMacroTask = /nochunking/.test(window.location.href);

export function macroTask(fn) {
  if (shouldNotUseMacroTask) {
    fn();
    return;
  }
  tasks.push(fn);
  next();
}

function run(event) {
  if (event.data != 'amp-macro-task') {
    return;
  }
  const t = tasks.shift();
  if (t) {
    t();
  }
  if (tasks.length) {
    next();
  }
}

function next() {
  window.postMessage('amp-macro-task', '*');
}

if (!initialized) {
  window.addEventListener('message', run);
}
