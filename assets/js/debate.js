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
	
};

k.editable = function() {
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
};


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

k.setUpThemeTags = function () {
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
};

/*
 * The graph set up
*/

k.setUpModel = function () {
	k.graphWidth = 640,
	k.graphHeight = 500,
	k.nodeWidth = 40,
	k.nodeHeight = 25,
	k.imageHeight = 10,
	k.imageWidth = 10,
	k.dataNodes = [],
	k.dataLinks = [],
	k.centered,
	k.previousScale;
	
	k.redraw = function () {
		k.vis.attr("transform",
				"translate(" + d3.event.translate + ")"
				+ " scale(" + d3.event.scale + ")");
	}
	
	k.zoom = d3.behavior.zoom()
					.on("zoom", k.redraw)
					.scaleExtent([2, 5.5]);
					
	k.vis = d3.select('#debate-graph')
						.append('svg:svg')
							.attr('width', k.graphWidth)
							.attr('height', k.graphHeight)
							.attr('pointer-events', 'all')
						.append('svg:g')
						  .call(k.zoom)
							.append('svg:g');
						
	k.vis.append('svg:rect')
			.attr('width', k.graphWidth)
			.attr('height', k.graphHeight)
			.attr('fill', 'white');
			
	k.vis.append("svg:defs").selectAll('marker')
			.data(['arrow']).enter()
			.append("svg:marker")
			.attr("id", String)
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 5)
			.attr("refY", -1.5)
			.attr("markerWidth", 3)
			.attr("markerHeight", 3)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");
			
	k.force = d3.layout.force()
						.charge(-180)
						.linkDistance(50)
						.size([k.graphWidth, k.graphHeight]);
	
	var Comment = Backbone.Model.extend();
	
	var comments = new Backbone.Collection([], {
		model: Comment,
		url: '/konfrap/comments/by_debate/' + debid,
		comparator: function (comment) {
			return comment.get('score');
		}
	});
	
	comments.on('add', function (comment) {
		
		k.dataNodes.push({
			'data': comment
		});
		k.force.nodes(k.dataNodes);
		if (comment.get('parent_id') != 0) {
			k.dataLinks.push({
				'target':comments.indexOf(comment),
				'source':comments.indexOf(comments.findWhere({'cid': comment.get('parent_id')}))
			});
		}
		k.force.links(k.dataLinks);
		k.force.start();
		
		var link = k.vis.selectAll('line.link')
							.data(k.dataLinks);
		
		link.enter().append("svg:line")
							.attr("class", "link")
							.style("stroke-width", 0.3)
							.style("stroke", '#BBB')
							.attr("marker-end", 'url(#arrow)')
							.attr("x1", function(d) { return d.source.x; })
							.attr("y1", function(d) { return d.source.y; })
							.attr("x2", function(d) { return d.target.x; })
							.attr("y2", function(d) { return d.target.y; });
							
		var node = k.vis.selectAll('svg.node')
							.data(k.dataNodes);
							
		node.enter().append('svg:svg')
							.attr('height', k.nodeHeight)
							.attr('width', k.nodeWidth)
							.attr('class', 'node')
							.attr('x', -8)
							.attr('y', -8);
		
		node.each(function (d) {
			
			d3.select(this).selectAll('image.node-image')
				.data([d.data.get('author')])
				.enter().append('image')
				.attr('xlink:href', function (fbid) {
					return 'http://graph.facebook.com/' + fbid + '/picture?type=square';
				})
				.attr('class', 'node-image')
				.attr('x', 2)
				.attr('y', 2)
				.attr('width', k.imageWidth)
				.attr('height', k.imageHeight);
			
			d3.select(this).selectAll('text.name')
				.data([d.data.get('name')])
				.enter().append('svg:text')
				.attr('class', 'name')
				.attr('textLength', function (n) { return n.length; })
				.text(function (n) { return n; })
				.style('font-size', '.18em')
				.style('font-weight', 'bold')
				.attr('x', 13)
				.attr('y', 4);
			
			var words = _.first(d.data.get('value').split(' '), 6);
			
			d3.select(this).selectAll('text.node-comment')
				.data([
						words.slice(0, words.length / 2).join(" "),
						words.slice(words.length / 2, words.length).join(" ")
					])
				.enter().append('svg:text')
				.attr('class', 'node-comment')
				.attr('textLength', function (c) { return c.length; })
				.style('font-size', '.16em')
				.style('color', '#666')
				.attr('x', 13)
				.attr('y', function (c, j) { return 6 + 2*j; })
				.text(function (c) { return c; });
		});
		node.on('click', k.onClick);
		
		k.force.on('tick', function () {
			link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });
					
			node.attr("x", function(d) { return d.x; })
					.attr("y", function(d) { return d.y; });
		});
	});
	/*
	var CommentReplyView = Backbone.View.extend({
		el: '#response-container',
		model: Comment,
		events: {
			'change #profile-image': 'setProfileImage',
			'change #author': 'setAuthor',
			'change #profile-image': 'setProfileImage',
			'change #profile-image': 'setProfileImage',
			
		}
	})
	*/
	comments.fetch();
	k.onClick = function (d) {
		var x, y, s, centroid;
		if (d && k.centered !== d) {
			centroid = [d.x + k.nodeWidth/2, d.y + k.nodeHeight/2];
			x = centroid[0];
			y = centroid[1];
			s = 4.5;
			k.centered = d;
		} else {
			x = k.graphWidth / 2;
			y = k.graphHeight / 2;
			s = 2;
			k.centered = null;
		}
		
		k.vis.transition()
			.duration(1000)
			.attr("transform", "translate(" + k.graphWidth / 2 + "," + k.graphHeight / 2 + ")scale("
						+ s + ")translate(" + -x + "," + -y + ")");
		
		k.zoom.scale(s);
		k.zoom.translate([-(s * x) + k.graphWidth / 2, -(s * y) + k.graphHeight / 2]);
		var data = d.data,
				author = data.get('author'),
				name = data.get('name'),
				side = data.get('relation_type') == 1 ? 'for' : 'against',
				score = data.get('score'),
				upvoters = data.get('upvoters'),
				downvoters = data.get('downvoters'),
				comment = data.get('value');
				
		if (k.centered) {
			$('.profile-image img').attr('src', 'http://graph.facebook.com/' +
																	 author + '/picture?type=square');
			
			$('#author').attr('href', '/konfrap/user/home/' + author);
			$('#author').html(name);
			$('#side').html('speaking ' + side);
			$('#score').html(score + ' points');
			$('#comment').html(comment);
			$('#debate-control').removeClass('hide');
			// check if vote buttons should be present
			if (_.indexOf(myfbid, upvoters) == -1 &&
					_.indexOf(myfbid, downvoters) == -1 && signed_in) {
				$('#upvote').removeClass('hide');
				$('#downvote').removeClass('hide');
			} else {
				$('#upvote').addClass('hide');
				$('#downvote').addClass('hide');
			}
			
			// check for support/rebutt display
			if (signed_in) {
				$('#support-point').removeClass('hide');
				$('#rebutt-point').removeClass('hide');
			} else {
				$('#support-point').addClass('hide');
				$('#rebutt-point').addClass('hide');
			}
			
		} else {
			$('#debate-control').addClass('hide');
		}
		
		// set up the click handlers
		$('.support-point').click(function () {
			$('.comment-container').removeClass('hide');
			k.createNewReplyComment(1, data);
		});
		$('.rebutt-point').click(function () {
			$('.comment-container').removeClass('hide');
			k.createNewReplyComment(0, data);
		});
	};
	
};

k.createNewReplyComment = function (side, parentComment) {
	$('#post-reply').click(function () {
		alert('jello!');
	});
	$('#cancel-reply').click(function () {
		$('#response-comment').val('');
		$('.comment-container').addClass('hide');
	});
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
	k.setUpThemeTags();
	k.editable();
	//k.initGraph();
	k.setUpModel();
});
