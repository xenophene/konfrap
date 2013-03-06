/* upvote listens to an upvote request on a comment, so as to increase the
   vote count of the selected comment on the debate in question from the 
   current user, visible only if the user has not already logged in  */
function vote(change, elem, className) {
  var votes = elem.parent().find('.votes .vote-count').html();
  votes = parseInt(votes) + change;
  elem.parent().find('.votes .vote-count').html(votes);
  elem.parent().find('.upvote').hide();
  elem.parent().find('.downvote').hide();
  /* send the information that this user has upvoted this comment */
  var comid = elem.parent().attr('name');
  var code = change == 1 ? 1 : 0;
  var request = $.ajax({
    url: 'includes/ajax_scripts.php',
    type: 'POST',
    data: {
      fid: 8,
      comid: comid,
      userid: user,
      upvote: code
    }
  });
  var voters = elem.parent().find('.votes ' + className).html();
  elem.parent().find('.votes ' + className).html(voters + ',' + userid);
}
function upvote() {
  vote(1, $(this), '#upvoters');
}
function downvote() {
  vote(-1, $(this), '#downvoters');
}
// shows the voters for this post
function showVoters() {
  var upvotersList = $(this).children('#upvoters').html();
  var downvotersList = $(this).children('#downvoters').html();
  if (upvotersList == '' && downvotersList == '') return;
  var upvoters = upvotersList.split(',');
  var downvoters = downvotersList.split(',');
  var heading = 'People who voted on this point';
  var code = '';
  if (upvotersList  != '') {
    code += '<h3>People who upvoted this point</h3>';
    code += '<p><ul>';
    for (var i = 0; i < upvoters.length; i++) {
      var id = $.trim(upvoters[i]);
      if (id == '') continue;
      code += '<li id="' + id + '"><a target="_blank" href="home.php?fbid=' + id + '"><img id="' + id + '" title="Upvoter" src="https://graph.facebook.com/' + id + '/picture"/></a></li>';
    }
    code += '</ul></p>';
  }
  if (downvotersList != '') {
    code += '<h3>People who downvoted this point</h3>';
    code += '<p><ul>';
    for (var i = 0; i < downvoters.length; i++) {
      var id = $.trim(downvoters[i]);
      if (id == '') continue;
      code += '<li id="' + id + '"><a target="_blank" href="home.php?fbid=' + id + '"><img id="' + id + '" title="Downvoter" src="https://graph.facebook.com/' + id + '/picture"/></a></li>';
    }
    code += '</ul></p>';
  }
  var id = '#overlay';
  renderOverlay(id, heading, code);
}
/* delete the comment that was added by me */
function deletePoint() {
  // send a delete query and remove this from view
  var comid = $(this).parent().attr('name');
  $(this).parent().slideUp({duration:'slow',easing: 'easeOutElastic'});
  var request = $.ajax({
    url: 'remove-comment.php',
    type: 'POST',
    data: {comid: comid}
  });
}
function commentHtml(luser, lmyname, comment_value) {
  var comment = '<div class="comment">';
  comment_value = marked(comment_value);
  comment_value = comment_value.replace(/\\/g, '');
  comment_value = comment_value.replace(/(\n)(?! )/g, '<br>');
  comment_value = comment_value.substring(0, comment_value.length - 4);
  comment += '<span class="author"><a href="home.php?fbid=' + luser + 
             '"><img class="author-pic" src="https://graph.facebook.com/' + luser + 
             '/picture?type=small"/>' + lmyname + '</a></span>';
  comment += '<span class="comment-data">' + comment_value + '</span>';
  if (user == luser) comment += '<span class="delete-point votes" title="Delete this point">Delete</span>';
  comment += '</div>';
  return comment;
}

function displayComment(side, formatComment) {
  $(side + ' #comments').prepend(formatComment);
  $(side + ' .comment').first().hide();
// By Utkarsh:Bad effects
//  $(side + ' .comment').first().slideDown({duration:'slow',easing: 'easeOutElastic'});
  $(side + ' .comment').first().slideDown("slow");
  $(side + ' .comment').first().effect("highlight", {}, 3000);
  $('.delete-point').click(deletePoint);
  $('.support-point').click(support_point);
  $('.rebutt-point').click(rebutt_point);
}

function pushComment(pushData) {
	var formatComment = commentHtml(pushData.author, pushData.authorname, pushData.value);
  if(pushData.foragainst) displayComment('#yes', formatComment);
  else displayComment('#no', formatComment);
}

/*
var pusher = new Pusher(PUSHER_APP_KEY);
var channel = pusher.subscribe('comments-' +  debid);
channel.bind('new_comment', pushComment);
*/
/* will look at the support point box, and if somethere will add it to the db
   and render it on the screen at the top even if there are higher votes above */
function post(side, formatComment, comment, parentComId) {
  var foragainstVal = side == '#yes' ? 1 : 0;
  displayComment(side, formatComment);
	var data = {
	  "fid"       : 5,
    "author"    : user, 
    "authorname": myname,
    "value"     : comment, 
    "debid"     : debid, 
    "foragainst": foragainstVal,
    "parentId"  : parentComId
	};
	if(pusher.connection.socket_id !== null) {
	  data.socket_id = pusher.connection.socket_id;
	}
	
  // send an ajax request to db for this comment
  var request = $.ajax({
    url: 'includes/ajax_scripts.php',
    type: 'POST',
    data: data,
    success: function(data) {
      $(side + ' .comment').first().attr('name', data);
    }
  });
}

function post_yes() {
  var yes_comment = $('#comment-yes').val();
  if (yes_comment == '') return;
  $('#comment-yes').val('');
  $('#post-yes').attr('disabled', 'disabled');
  $('#comment-yes').css('height', '36px');
  var comment = commentHtml(user, myname, yes_comment);
  post('#yes', comment, yes_comment, -1);
}
function post_no() {
  var no_comment = $('#comment-no').val();
  if (no_comment == '') return;
  $('#comment-no').val('');
  $('#post-no').attr('disabled', 'disabled');
  $('#comment-no').css('height', '36px');
  var comment = commentHtml(user, myname, no_comment);
  post('#no', comment, no_comment, -1);
}
/* support_point operates on a particular point and helps to directly counter
  or support whatever the point was talking about. this helps in a more one-on-one
  interaction which can be more fruitful for the user. 
  on clicking, we show a new textbox below this comment, which has a parent id
  pointing to this comid, and get shifted to the same side. we also add a 
  view-conversation link to see the whole tree of comments from any node */
function cancelReply() {
  $(this).parent().slideUp("normal", function() { $(this).remove(); } );
}
function postReply() {
  var origSide = $(this).parent().parent().parent().parent().attr('id');
  var replySide = $(this).parent().attr('id');
  var newSide;
  if (replySide == 'support') newSide = origSide;
  else newSide = origSide == 'yes' ? 'no' : 'yes';
  
  var comment = $(this).parent().children('textarea').val();
  var parentComId = $(this).parent().parent().attr('name');
  $(this).parent().slideUp("normal", function() { $(this).remove(); } );
  var formatComment = commentHtml(user, myname, comment);
  post('#' + newSide, formatComment, comment, parentComId);
}
function setUpReply (elem, side) {
  var code = '<div class="reply" id="'+side+'">';
  code += '<textarea placeholder="'+(side.slice(0,1).toUpperCase() + side.slice(1))+' this point..."></textarea><br>';
  code += '<button id="post-reply" class="btn btn-primary reply-post-btn" disabled>Post</button>';
  code += '<button id="cancel-reply" class="btn reply-post-btn">Cancel</button>';
  code += '</div>';
  var code = $(code).hide();
  code.appendTo(elem.parent()).slideDown();
  elem.parent().find('textarea').autosize();
  elem.parent().find('textarea').keyup(function () {
    if ($(this).val().length > 0)
      $(this).parent().children('#post-reply').removeAttr('disabled');
    else
      $(this).parent().children('#post-reply').attr('disabled', 'disabled');
  });
  elem.parent().find('#post-reply').click(postReply);
  elem.parent().find('#cancel-reply').click(cancelReply);
}
function support_point() {
  // show the textarea below this
  if ($(this).parent().children('.reply').length == 0) {
    setUpReply($(this), 'support');
  } else {
    $(this).parent().children('.reply').attr('id', 'support');
    $(this).parent().find('textarea').val('');
    $(this).parent().find('textarea').attr('placeholder', 'Support this point...');
  }
  /*
  $('html').animate({
	    scrollTop: 0
    }, 800);
  if ($(this).parent().parent().parent().attr('id') == 'yes')
    $('#comment-yes').focus();
  else
    $('#comment-no').focus();
  */
}
function rebutt_point() {
  if ($(this).parent().children('.reply').length == 0)
    setUpReply($(this), 'rebutt');
  else {
    $(this).parent().children('.reply').attr('id', 'rebutt');
    $(this).parent().find('textarea').val('');
    $(this).parent().find('textarea').attr('placeholder', 'Rebutt this point...');
  }
  /*
  $(document).animate({
      scrollTop: 0
    }, 800);
  if ($(this).parent().parent().parent().attr('id') == 'yes')
    $('#comment-no').focus();
  else
    $('#comment-yes').focus();
  */
}

/* view participants for this debate */
function showConnections(evt) {
  /* render the layover and show the list of friends */
  var pids = evt.data.p == 1 ? participantIds : followerIds;
  var heading = evt.data.p == 1 ? 'Participants' : 'Followers';
  
  var code = '<ul>';
  var n = pids.length;
  for (var i = 0; i < pids.length; i++) {
    code += '<li id="' + pids[i] + '"><a target="_blank" href="home.php?fbid=' + 
            pids[i] + '"><img id="' + pids[i] + '" src="https://graph.facebook.com/' + 
            pids[i] + '/picture"/></a></li>';
  }
  code += '</ul>';
  var id = '#overlay';
  renderOverlay(id, heading, code);
}

function invite_to_debate() {
  var code = '<input type="text" name="participants" title="Participants" ' + 
             'id="participants" class="input-xxlarge ui-autocomplete-input" ' +
             'placeholder="Challenge Friends" autocomplete="off" spellcheck="false"/>';
  code += '<a class="btn btn-primary" id="invite-friends">Invite</a>';
  var heading = 'Invite Friends to debate';
  var id = '#overlay';
  renderOverlay(id, heading, code);
  if (friendNames == null) {
    $.ajax({
      url: 'get-my-friends.php',
      success: function(data) {
        var result = JSON.parse(data);
        var names = Array();
        var ids = Array();
        for (var i = 0; i < result.data.length; i++) {
          names.push(result.data[i].name);
          ids.push(result.data[i].id);
        }
        $( "#participants").autocomplete({
				  minLength: 3,
				  source: function( request, response ) {
					  // delegate back to autocomplete, but extract the last term
					  response( $.ui.autocomplete.filter(
						  names, extractLast( request.term ) ) );
				  },
				  focus: function() {
					  // prevent value inserted on focus
					  return false;
				  },
				  select: function( event, ui ) {
					  var terms = split( this.value );
					  // remove the current input
					  terms.pop();
					  // add the selected item
					  terms.push( ui.item.value );
					  // add placeholder to get the comma-and-space at the end
					  terms.push( "" );
					  this.value = terms.join( ", " );
					  return false;
				  },
				  maxResults: 4
			  });
        friendNames = names;
        friendIds = ids;
      }
    });
    // enable the participants file
  }
  else {
    $( "#participants" ).autocomplete({
	    minLength: 3,
	    source: function( request, response ) {
		    // delegate back to autocomplete, but extract the last term
		    response( $.ui.autocomplete.filter(
			    friendNames, extractLast( request.term ) ) );
	    },
	    focus: function() {
		    // prevent value inserted on focus
		    return false;
	    },
	    select: function( event, ui ) {
		    var terms = split( this.value );
		    // remove the current input
		    terms.pop();
		    // add the selected item
		    terms.push( ui.item.value );
		    // add placeholder to get the comma-and-space at the end
		    terms.push( "" );
		    this.value = terms.join( ", " );
		    return false;
	    },
	    maxResults: 4
    });
  }
  $('#invite-friends').click(inviteFriends);
}
// send notifications to my friends and add them as participants
function inviteFriends() {
  var participants = $('#participants').val().split(',');
  var names = [];
  var ids = [];
  var j = 0;
  for (var i = 0; i < participants.length - 1; i++) {
    var s = $.trim(participants[i]);
    var index = $.inArray(s, friendNames);
    if (index != -1) {
      ids[j] = friendIds[index];
      names[j] = s;
      j++;
    }
  }
  $.ajax({
    url: 'ajax_scripts.php',
    type: 'POST',
    data: {
      fid: '4',
      ids: ids.join(','),
      idNames: names.join(','),
      debid: debid,
      inviterName: myname,
      inviterId: userid
    },
    success: function (data) {
      console.log(data);
    }
  });
  $('#overlay').modal('hide');
}
function editDescription() {
  var para = $('#desc-data');
  var descOrig = para.html().trim();
  var width = para.css('width');
  para.html('<textarea></textarea>');
  var textarea = para.children('textarea');
  textarea.css('width', width);
  textarea.val(descOrig);
  textarea.autosize();
}


$('.editable').each(function () {
	var field_type,
			id;
		
	id = $(this).attr('name');
	
	if ($(this).hasClass('topic')) {
		field_type = 'topic';
	} else if ($(this).hasClass('desc')) {
		field_type = 'description';
	}
	
	$(this).editable({
		mode:	'inline',
		placement: 'bottom',
		inputclass: 'input-xlarge',
		type: 'textarea',
		pk:		id,
		name: field_type,
		url:	'/konfrap/debate/edit_field/',
		title:	'Enter ' + field_type
	});
	
});



// view conversation starting from this conversation upwards following parent
// pointers
function viewConversation() {
  var thisComid = $(this).parent().attr('name');
  var code = '<div class="comment">';
  code += '<span class="author">' + 
          $(this).parent().children('.author').html() + '</span>';
  code += '<span class="comment-data">' + 
          $(this).parent().children('.comment-data').html() + '</span>';
  code += '</div>';
  var parentId = $(this).attr('name');
  var heading = 'View Full Conversation';
  while (parentId) {
    var parentDiv = $('.comment[name=' + parentId + ']');
    parentId = parentDiv.children('.view-conversation').attr('name');
    var pcode = '<div class="comment">';
    pcode += '<span class="author">' + 
            parentDiv.children('.author').html() + '</span>';
    pcode += '<span class="comment-data">' + 
            parentDiv.children('.comment-data').html() + '</span>';
    pcode += '</div>';
    code = pcode + code;
  }
  var id = '#overlay';
  renderOverlay(id, heading, code);
  console.log(code);
}
function popovers() {
  $('#invite-to-debate').popover({
    title: 'Invite friends to debate',
    content: 'Promote this debate among your friends allowing them to participate and contribute to the debate.',
    placement: 'left'
  });
  $('#follow-debate').popover({
    title: 'Follow Debate',
    content: 'Follow this debate to stay updated with who said what.',
    placement: 'left'
  });
  $('#friend-search').tooltip({
    title: 'Search Debaters on IIT Debates',
    placement: 'left'
  });
  $('.view-conversation').tooltip({
    title: 'This post is part of a conversation. View the enter conversation'
  });
  $('.add').tooltip();
  $('.vote-store').tooltip();
  $('.comment-date').tooltip();
  $('.delete-point').tooltip();
  $('.support-point').tooltip();
  $('.rebutt-point').tooltip();
  $('.theme').tooltip();
}
/* follow debate */
function followDebate() {
  if ($(this).hasClass('btn-primary')) {
    $(this).removeClass('btn-primary');
    $(this).addClass('btn-danger');
    $(this).addClass('disabled');
    $(this).html('Following');
    $.ajax({
      url: 'includes/ajax_script.php',
      type: 'POST',
      data: {
				fid: 7,
				follower: user,
				debid: debid
			}
    });
  }
}
function show_format_rules() {
  if ($(this).parent().find('.rules').length != 0)
    return;
  var code = '<div class="rules">';
  code += '<h4>Thank you for contributing your point of view.</h4>';
  code += '<p>Please be impartial, rational and logical in your view points. This is an open and democratic forum and all sides have an equal say. You can highlight your content using these options.</p>';
  code += '<p><ol>';
  code += '<li>Bold - Wrap text by **</li>';
  code += '<li>Emphasize - Wrap text by *</li>';
  code += '<li>Links - Just add the link</li>';
  code += '</ol></p></div>';
  code = $(code).hide();
  code.insertBefore($(this)).slideDown();
}
function hide_format_rules() {
  $('.rules').slideUp("normal", function() { $(this).remove(); } );
}
function formatString(str) {
	str = marked(str);
	return str;
}
// desanitize will try to add formatting elements to the text
function desanitize() {
  // for all the comments, run marked
  $('.comment .comment-data').each(function () {
    var newcomm = formatString($(this).html());
    $(this).html(newcomm);
  });
  var desc = $('.desc').html();
  $('.desc').html(desc);
}

function setUpThemeTags() {
	$('#theme-tags').tagit({
		removeConfirmation: true,
		allowSpaces: true,
		placeholderText: 'add more themes...',
		availableTags: themes,
		autocomplete: {
			source: function(request, response) {
        var results = $.ui.autocomplete.filter(themes, request.term);
        response(results.slice(0, 10));
			},
			delay: 100,
			minLength: 2
		},
		afterTagAdded: function (evt, ui) {
			if (!ui.duringInitialization) {
				$.ajax({
					url: '/konfrap/debate/add_theme',
					type: 'POST',
					data: {
						'id': debid,
						'val': ui.tagLabel
					}
				});
			}
		},
		afterTagRemoved: function (evt, ui) {
			$.ajax({
				url: '/konfrap/debate/remove_theme',
				type: 'POST',
				data: {
					'id': debid,
					'val': ui.tagLabel
				}
			});
		}
	})
}
$(function() {
	
  //$('textarea.yes, textarea.no').autosize();
  $('.upvote').click(upvote);
  $('.downvote').click(downvote);
  $('.support-point').click(support_point);
  $('.rebutt-point').click(rebutt_point);
  $('.delete-point').click(deletePoint);
  $('.vote-store').click(showVoters);
  $('.view-conversation').click(viewConversation);
  $('#post-yes').click(post_yes);
  $('#post-no').click(post_no);
  $('#view-participants').click({p: 1}, showConnections);
  $('#view-followers').click({p: 2}, showConnections);
  $('#invite-to-debate').click(invite_to_debate);
  $('#follow-debate').click(followDebate);
  //$('#edit-desc').click(editDescription);
  $('textarea.yes, textarea.no').focus(show_format_rules);
  $('textarea.yes, textarea.no').blur(hide_format_rules);
  $('textarea.yes, textarea.no').keyup(function() {
    if ($(this).val().length > 0) {
      if ($(this).attr('class') == 'yes') {
        $('#post-yes').removeAttr('disabled');
      } else {
        $('#post-no').removeAttr('disabled');
      }
    } else {
      if ($(this).attr('class') == 'yes') {
        $('#post-yes').attr('disabled', 'disabled');
      } else {
        $('#post-no').attr('disabled', 'disabled');
      }
    }
  });
	/*
  marked.setOptions({
    gfm: true,
    pedantic: false,
    sanitize: true,
    // callback for code highlighter
    highlight: function(code, lang) {
      if (lang === 'js') {
        return javascriptHighlighter(code);
      }
      return code;
    }
  });
  */
  desanitize();
  //popovers();
	
	setUpThemeTags();
});
