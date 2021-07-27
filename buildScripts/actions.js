import ActionTypes from './actionTypes.js';
const username = '';
const password = '';
export default [
    {
      actionType: ActionTypes.NAVIGATE,
      url: 'https://www.github.com/login'
    },
    {
      actionType: ActionTypes.ENTER_TEXT,
      selector: '#login_field',
      content: username
    },
    {
      actionType: ActionTypes.ENTER_TEXT,
      selector: '#password',
      content: password
    },
    {
      actionType: ActionTypes.CLICK,
      selector: '#password ~ .btn'
    },
    {
      actionType: ActionTypes.NAVIGATE,
      url: `https://github.com/${username}?tab=repositories`
    },
    // {
    //   actionType: ActionTypes.CLICK,
    //   selector: '.js-profile-editable-replace a, h2 a'
    // },
    {
      actionType: ActionTypes.CLICK,
      position: {x: 30, y: 180}
    }
];