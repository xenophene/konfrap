// global variables useful across files
var names = [],
    ids = [],
    searchtypes = [],

    friendIds = null,
    friendNames = null,
    
    themes = ['IIT Mess', 'IIT Politics', 'IIT Academics', 'IIT Hostels',
              'IIT Cultural Events', 'IIT Sports Events', 'Nation & Economy'];

/* Library of common auxiliary functions that will be used by all the main
  js files on the respective pages */
function arrayFilter(e) { return e; }
function split( val ) {
  return val.split( /,\s*/ );
}
function extractLast( term ) {
  return split( term ).pop();
}
function keyValueString(obj) {
  var s = [];
  for (var k in obj) {
    s.push(k + '=' + obj[k]);
  }
  return s.join('&');
}

/* Set up the user search functionality by querying through AJAX the user base */
function setUpSearch(data) {
  for (var i = 0; i < data.length; i++) {
    var x = data[i];
    names.push($.trim(x.name));
    ids.push(x.id);
    searchtypes.push(x.ltype);
  }
  $('#friend-search').typeahead({
    source: names,
    items: 5
  });
}
function searchSetup() {
  $.ajax({
    url: '/konfrap/user/all',
    dataType: 'json',
    success: setUpSearch
  });
  $.ajax({
    url: '/konfrap/debate/all',
    dataType: 'json',
    success: setUpSearch
  });
  $('#friend-search').keypress(function(evt) {
    if (evt.which != 13) return true;
    else {
      var sname = $(this).val();
      var i = $.inArray(sname, names);
      if (i != -1) {
        if (searchtypes[i] == 'u') {
          window.location = '/konfrap/user/home/' + ids[i] + '/2';
        } else {
          window.location = '/konfrap/debate/' + ids[i];
        }
      } else {
        $(this).val('');
      }
      return false;
    }
  });
  $('.icon-search').click(function() {
    var sname = $(this).parent().children('input').val();
    var i = $.inArray(sname, names);
    if (i != -1) window.location = '/konfrap/user/home/' + ids[i] + '/2';
    else $(this).parent().children('input').val('');
  });
}

function renderOverlay(id, heading, code) {
  $(id + ' .modal-header h1').html(heading);
  if (code == '<ul></ul>') {
    $(id + ' .modal-body').html('<p>No users in this activity</p>');
  } else {
    $(id + ' .modal-body').html(code);
  }
  
  $(id + ' li a img').each(function () {
    nameFromId($(this), $(this).parent().parent().attr('id'));
  });
  $(id).modal('show');
}
function resolveIds() {
  $('.resolve').each(function () {
    var elt = $(this);
    $.ajax({
      url: 'https://graph.facebook.com/' + elt.html(),
      dataType: 'json',
      success: function (data) {
        elt.html(data.name);
      }
    });
  });
}
function nameFromId(elmt, fbid) {
  $.ajax({
    url: 'https://graph.facebook.com/' + fbid,
    dataType: 'json',
    success: function (data) {
      elmt.attr('title', data.name);
      elmt.tooltip();
    }
  });
}
function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function init() {
  $.ajax({
    url: '/konfrap/user/my_friends',
    dataType: 'json',
    success: function(result) {
      friendNames = [],
      friendIds = {};
      for (var i = 0; i < result.data.length; i++) {
        friendNames.push(result.data[i].name);
        friendIds[result.data[i].name] = result.data[i].id;
      }
      if (typeof(ufbid) !== 'undefined' && myfbid !== ufbid &&
          !friendIds[uname]) {
        friendIds[uname] = ufbid;
        friendNames.push(uname);
      }
    }
  });
}
function showLoadingModal() {
  var loadingImg = '<img src="/konfrap/assets/img/loading3.gif">';
  renderOverlay('#overlay', '<h2>Loading...</h2>', loadingImg);
}
$(function () {
  //addDivider();
  searchSetup();
  resolveIds();
  $('.tip').each(function() {$(this).tooltip(); });
});
init();