k.invite_to_debate = function () {
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
  $('#invite-to-debate').click(k.invite_to_debate);
  $('#follow-debate').click(followDebate);
	setUpThemeTags();
});
