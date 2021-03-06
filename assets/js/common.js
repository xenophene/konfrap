// global variables useful across files
var k = {};
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
k.setUpSearch = function (data) {
  for (var i = 0; i < data.length; i++) {
    var x = data[i];
    names.push($.trim(x.name));
    ids.push(x.id);
    searchtypes.push(x.ltype);
  }
  $('.navbar-search').removeClass('hide');
  $('.icon-search').removeClass('hide');
  $('#friend-search').typeahead({
    source: names,
    items: 5
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
function searchSetup() {
  $.ajax({
    url: '/konfrap/user/all',
    dataType: 'json',
    success: k.setUpSearch
  });
  $.ajax({
    url: '/konfrap/debate/all',
    dataType: 'json',
    success: k.setUpSearch
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
    k.nameFromId($(this), $(this).parent().parent().attr('id'));
  });
  $(id).modal('show');
}
k.resolveIds = function () {
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
k.nameFromId = function (elmt, fbid) {
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

k.init = function () {
  $.ajax({
    url: '/konfrap/user/my_friends',
    dataType: 'json',
    success: function(result) {
      if (!result) {
        return;
      }
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
  searchSetup();
}
k.ready = function() {
  k.resolveIds();
}
function showLoadingModal() {
  var loadingImg = '<img src="/konfrap/assets/img/loading3.gif">';
  renderOverlay('#overlay', '<h2>Loading...</h2>', loadingImg);
}

k.showConnections = function (evt) {
  var pids = evt.data.ids,
      heading = evt.data.text;
  
  var code = '<ul>',
      id = '#overlay',
      n = pids.length;
      
  for (var i = 0; i < pids.length; i++) {
    code += '<li id="' + pids[i] + '"><a target="_blank" href="/konfrap/user/home/' +
            pids[i] + '"><img id="' + pids[i] + '" src="https://graph.facebook.com/' + 
            pids[i] + '/picture"/></a></li>';
  }
  
  code += '</ul>';
  
  renderOverlay(id, heading, code);
};

$(function () {
  k.ready();
  $('.tip').each(function() {$(this).tooltip(); });
});
k.init();