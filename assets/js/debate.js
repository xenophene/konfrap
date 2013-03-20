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

function invite_to_debate() {
	if (friendNames == null) return;
	
	var code = '<ul class="outline" id="participants"></ul>';
  code += '<a class="btn btn-custom" id="invite-friends">Invite</a>';
  var heading = 'Invite Friends to debate';
  var id = '#overlay';
  renderOverlay(id, heading, code);
	
	$('#participants').tagit({
		removeConfirmation: true,
		allowSpaces: true,
		placeholderText: 'Add participants...',
		availableTags: friendNames,
		autocomplete: {
			source: function(request, response) {
        var results = $.ui.autocomplete.filter(friendNames, request.term);
        response(results.slice(0, 10));
			},
			delay: 100,
			minLength: 2
		}
	});
  $('#invite-friends').click(function () {
		var participants = $('#participants').tagit('assignedTags');
		var indexes = [];
		participants.map(function (e) {
				indexes.push(friendIds[e]);
		});
		$.ajax({
			url:  '/konfrap/debate/invite_friends',
			type: 'POST',
			data: {
				'id': debid,
				'friendList': indexes.join(),
				'inviterId': myfbid
			}
		});
		$('#overlay').modal('hide');
	});
	
}

$('.editable').each(function () {
	var field_type,
			id;
	if ( ! signed_in) return;
	id = $(this).attr('name');
	
	if ($(this).hasClass('topic')) {
		field_type = 'topic';
	} else if ($(this).hasClass('desc')) {
		field_type = 'description';
	}
	
	$(this).editable({
		placement: 'bottom',
		type: 'textarea',
		pk:		id,
		name: field_type,
		url:	'/konfrap/debate/edit_field/',
		title:	'Modify ' + field_type
	});
	
});


/* follow debate */
function auxFollowDebate(elmt, oldClassName, newClassName, fCode, htmlCode) {
  elmt.removeClass(oldClassName);
  elmt.addClass(newClassName);
  elmt.html(htmlCode);
  /* send follow AJAX request */
  $.ajax({
    url: '/konfrap/debate/' + fCode,
    type: 'POST',
    data: {
      'follower': myfbid,
      'debate_id': debid
    }
  });
}
function followDebate () {
  if ($(this).hasClass('btn-primary')) {
    auxFollowDebate($(this), 'btn-primary', 'btn-danger', 'follow', 'Unfollow');
		followerIds.push(myfbid);
  }
  else {
    auxFollowDebate($(this), 'btn-danger', 'btn-primary', 'unfollow', 'Follow');
		followerIds.splice(followerIds.indexOf(myfbid), 1);
  }
}

function setUpThemeTags() {
	$('#theme-tags').tagit({
		removeConfirmation: true,
		readOnly: signed_in ? false : true,
		allowSpaces: true,
		placeholderText: signed_in ? 'add more themes...' : '',
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
	
  $('#view-participants').click({
			text: 'Participants',
			ids:	participantIds
		}, k.showConnections
	);
  $('#view-followers').click({
			text: 'Followers',
			ids: followerIds
		}, k.showConnections
	);
  $('#invite-to-debate').click(invite_to_debate);
  $('#follow-debate').click(followDebate);
	setUpThemeTags();
});
