/**
  * Defines a debate on a user clicking start a new debate. This function
  * is the base function. The parameters which are requested:
  * Debate topic, Debate description, Debate themes, Context links/urls, Friends
  * who are challenged for or against this debate, the debate deadline
  */
function setUpTypeahead() {
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
	$('#overlay').modal('hide');
	$('#start-debate-form').modal('show');
}
function defineDebate() {
	
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
		showLoadingModal();
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
				setUpTypeahead();
      }
    });
  } else {
		setUpTypeahead();
  }
}

$('#start-debate-form form').submit(function() {
	var participants = $('#participants').tagit('assignedTags');
  var indexes = [];
	participants.map(function (e) {
		if (e in friendIds) {
			indexes.push(friendIds[e]);
		} else {
			indexes.push(ufbid);
		}
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
				console.log('something bad happened!');
				$('#start-debate-form').modal('hide');
			} else {
				window.location = '/konfrap/debate/' + data;
			}
    },
    error: function(msg) {
      console.log(msg);
    }
  });
  $('#start-loading').toggle();
  return false;
});

/* subset of defineDebate for a TARGETTED debate*/
function defineChallengeDebate() {
  defineDebate();
	$('#participants').tagit('createTag', $('tr td.name').html());
}
function clearDebateForm() {
  $('#debate-topic').val('');
  $('#debate-desc').val('');
  $('#debate-theme').tagit('removeAll');
  $('#participants').tagit('removeAll');
}
/* Follow this user, toggling the state/css, to unfollow and follow */
function auxFollowUser(elmt, oldClassName, newClassName, fCode, htmlCode) {
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
function followUser () {
  if ($(this).hasClass('btn-primary')) {
    auxFollowUser($(this), 'btn-primary', 'btn-danger', 'follow', 'Unfollow');
  }
  else {
    auxFollowUser($(this), 'btn-danger', 'btn-primary', 'unfollow', 'Follow');
  }
}


/* delete Debate will take the debate and remove myself from the participant list */
function debateDelete() {
  $('.delete-debate').tooltip('hide');
  var debid = $(this).parent().parent().children('td.dname').attr('id');
  $.ajax({
    url: 'includes/ajax_scripts.php',
    type: 'POST',
    data: {
      fid: 6,
      debid: debid,
      user: myfbid
    }
  });
  $(this).parent().parent().fadeOut();
  $(this).parent().parent().remove();
  if (!$('.debate-table tbody').children().size()) { // remove the tbody
    $('.debate-table tbody').append('<tr id="nill"><td>You ' +
																		"don't have any ongoing debates right now</td></tr>");
    $('.debate-table thead').html('');
  }
}

/* clear Overlay */
function clearOverlay() {
  $('.window').hide();
  $('#mask').hide();
}

/* show my connections */
function showConnections(evt) {
  var pids = evt.data.p == 1 ? followers : followees;
  var heading = evt.data.p == 1 ? 'Followers' : 'Followees';
  if (!pids.length) return;
  var n = pids.length;
  var code = '<ul>';
  for (var i = 0; i < n; i++) {
    code += '<li id="' + pids[i] + '"><a target="_blank" href="/konfrap/user/home/' +
	  pids[i] + '"><img id="' + pids[i] + '" src="https://graph.facebook.com/' +
	  pids[i] + '/picture"/></a></li>';
  }
  code += '</ul>';
  var id = '#overlay';
  renderOverlay(id, heading, code);
}

function popovers() {
  $('.debate-table').popover({
    title: 'The Debate Table',
    content: 'View performance on ongoing & past debates'
  });
  $('#interested-in').popover({
    title: 'Interested In',
    content: 'All the debating themes you are interested to debate in.'
  });
  $('#debating-points').popover({
    title: 'Debating Points',
    content: 'Debating Points accumulated over time by winning valuable debates. The points for a debate result from the popularity that the debate garners over time. When a debate gets over, the points it had get distributed among its participants. The more votes a comment got, the more points its author gets at the end.'
  });
  $('#debates-won').popover({
    title: 'Debates Won',
    content: 'Number of debates won over time.'
  });
  $('#modify-profile').popover({
    title: 'Modify Profile',
    content: 'Modify your profile to add debate themes and interests.',
    placement: 'bottom'
  });
  $('#debate-topic').popover({
    content: 'Enter the debate topic'
  });
  $('#debate-desc').popover({
    content: 'Give some optional description to motivate the need to debate this topic and who all should care for the topic. Provide more context to the debate by providing external URLs giving it a defined direction.'
  });
  $('#debate-theme').popover({
    content: 'Enter one or more of the predefined categories that this debate falls under'
  });
  $('#participants').popover({
    content: 'Invite your friends who would be most interested to express their views on this topic'
  });
  $('#radio').popover({
    content: 'Set a time limit for this debate after which no participant will be able to make further comments.'
  });
  $('#radio2').popover({
    content: 'Any debater can participate & comment in a public debate. Private debates require invites from participants.'
  });
  $('#invite').popover({
    content: 'Invite this person to one my ongoing debates',
    placement: 'left'
  });
  $('#follow').popover({
    content: "Follow this person's debates and activity",
    placement: 'left'
  });
	$('#challenge').popover({
    content: "Challenge this person to a new debate",
    placement: 'left'
  });
  $('#post-to-fb').tooltip();
  $('.add').tooltip({
    title: 'Modify/Add Debating interests'
  });
  $('.delete-debate').tooltip({
    title: 'Remove myself as a participant',
    placement: 'left'
  });
}

function postFb() {
  $(this).toggleClass('active');
  if ($('#post-to-fb-input').val() == '0') {
    $('#post-to-fb-input').val('1');
    $(this).html('This debate will be posted on Facebook');
  }
  else {
    $('#post-to-fb-input').val('0');
    $(this).html('Post this debate on to Facebook');
  }
}

function setUpInterests() {
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
  clearDebateForm();
  $('#start').click(defineDebate);
  $('#start-debate-form input').keyup(function() {
    if ($('#debate-topic').val().length > 5 && $('#participants').val().length > 3)
      $('#start-debate').removeAttr('disabled');
  });
  $('#post-to-fb').click(postFb);
  $('#start-debate-form').on('hidden', clearDebateForm);
  $('#challenge').click(defineChallengeDebate);
  $('#follow').click(followUser);
  $('#radio').buttonset();
  $('#radio2').buttonset();
  $('.delete-debate').click(debateDelete);
  $('#my-followers').click({p: '1'}, showConnections);
  $('#my-followees').click({p: '2'}, showConnections);
  //popovers();
	//setEditable();
	setUpInterests();
});