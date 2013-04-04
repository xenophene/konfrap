k.setUpTypeahead = function() {
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
	$('#participants').removeClass('hide');
	if (myfbid !== ufbid) {
		$('#participants').tagit('createTag', $('tr td.name').html());
	}
	$('#start-loading').addClass('hide');
	$('#start-debate').removeClass('hide');
}
k.defineDebate = function () {
	k.clearDebateForm();
  $( "#debate-theme" ).tagit({
    removeConfirmation: true,
		allowSpaces: true,
		placeholderText: 'Add themes...',
		availableTags: themes,
		autocomplete: {
			source: function(request, response) {
        var results = $.ui.autocomplete.filter(themes, request.term);
        response(results.slice(0, 10));
			},
			delay: 100,
			minLength: 3
		}
  });
  if (friendNames == null) {
    $.ajax({
      url: '/konfrap/user/my_friends',
      dataType: 'json',
      success: function(result) {
				if (!result || !result.data) {
					$('#debate-error').removeClass('hide');
					$('#start-loading').addClass('hide');
					return;
				}
        friendNames = [],
        friendIds = {};
        for (var i = 0; i < result.data.length; i++) {
          friendNames.push(result.data[i].name);
					friendIds[result.data[i].name] = result.data[i].id;
        }
				if (myfbid !== ufbid && !friendIds[uname]) {
					friendIds[uname] = ufbid;
					friendNames.push(uname);
				}
				k.setUpTypeahead();
      }
    });
  } else {
		k.setUpTypeahead();
  }
}
$('#start-debate-form form').submit(function() {
	var participants = $('#participants').tagit('assignedTags');
  var indexes = [];
	participants.map(function (e) {
		indexes.push(friendIds[e]);
	});
  $('#debate-desc').val($('#debate-desc').val().replace(/(^,)|(,$)/g, ""));
  $('#participants-names').val(participants.join());
  $('#participant-ids').val(indexes.join());
	
  var debtopic = $('#debate-topic').val();
  var debdesc = $('#debate-desc').val();
  var debthemes = $('#debate-theme').tagit('assignedTags').join();
	
  var partids = $('#participant-ids').val();
  var partnames = $('#participants-names').val();
  $.ajax({
    url: '/konfrap/debate/create',
		type: 'POST',
    data: {
      'debate-topic': debtopic,
      'debate-description': debdesc,
      'debate-themes': debthemes,
      'participant-ids': partids,
			'myfbid': myfbid
    },
    success: function (data) {
      if (data === "0") {
				$('#debate-error').removeClass('hide');
				$('#start-loading').addClass('hide');
				k.clearDebateForm();
			} else {
				window.location = '/konfrap/debate/' + data;
			}
    },
    error: function(msg) {
      console.log(msg);
    }
  });
  $('#start-loading').removeClass('hide');
  return false;
});

/* subset of defineDebate for a TARGETTED debate*/
k.defineChallengeDebate = function () {
  k.defineDebate();
	
}
k.clearDebateForm = function () {
  $('#debate-topic').val('');
  $('#debate-desc').val('');
  $('#debate-theme').tagit('removeAll');
  $('#participants').tagit('removeAll');
}
/* Follow this user, toggling the state/css, to unfollow and follow */
k.auxFollowUser = function (elmt, oldClassName, newClassName, fCode, htmlCode) {
  elmt.removeClass(oldClassName);
  elmt.addClass(newClassName);
  elmt.html(htmlCode);
  /* send follow AJAX request */
  $.ajax({
    url: '/konfrap/user/' + fCode,
    type: 'GET',
    data: {
      'follower': myfbid,
      'followee': ufbid
    },
		success: function (d) {
			console.log(d);
		}
  });
}
k.followUser = function() {
  if ($(this).hasClass('btn-primary')) {
    k.auxFollowUser($(this), 'btn-primary', 'btn-danger', 'follow', 'Unfollow');
  }
  else {
    k.auxFollowUser($(this), 'btn-danger', 'btn-primary', 'unfollow', 'Follow');
  }
}


/* delete Debate will take the debate and remove myself from the participant list */
k.debateDelete = function () {
  var debid = $(this).parent().parent().attr('id');
  $.ajax({
    url: '/konfrap/debate/unfollow',
    type: 'POST',
    data: {
      debate_id: debid,
      follower: myfbid
    }
  });
  $(this).parent().parent().slideUp().remove();
}

/* clear Overlay */
k.clearOverlay = function () {
  $('.window').hide();
  $('#mask').hide();
}

k.setUpInterests = function () {
	$('#interest-tags').tagit({
		readOnly: ufbid !== myfbid,
		removeConfirmation: true,
		availableTags: themes,
		autocomplete: {
			source: function(request, response) {
        var results = $.ui.autocomplete.filter(themes, request.term);
        response(results.slice(0, 10));
			},
			delay: 100,
			minLength: 2
		},
		allowSpaces: true,
		placeholderText: ufbid !== myfbid ? '' : 'add interests...',
		afterTagAdded: function (evt, ui) {
			if (!ui.duringInitialization) {
				$.ajax({
					url: '/konfrap/user/add_interest',
					data: {
						'uid': uuid,
						'val': ui.tagLabel
					}
				});
			}
		},
		afterTagRemoved: function (evt, ui) {
			$.ajax({
				url: '/konfrap/user/remove_interest',
				data: {
					'uid': uuid,
					'val': ui.tagLabel
				}
			});
		}
	});
}
$(function() {
  k.clearDebateForm();
  //$('#start').click(k.defineDebate);
  //$('#start-debate-form').on('hidden', k.clearDebateForm);
  //$('#challenge').click(k.defineChallengeDebate);
  
	$('#follow').click(k.followUser);
  $('.delete-debate').click(k.debateDelete);
	
  $('#my-followers').click({
			text: 'Followers',
			ids: followers
		}, k.showConnections
	);
  $('#my-followees').click({
			text: 'Followees',
			ids: followees
		}, k.showConnections
	);
	k.setUpInterests();
	k.defineDebate();
});