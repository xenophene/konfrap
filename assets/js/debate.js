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

k.initGraph = function () {
	k.graphWidth = 640,
	k.graphHeight = 500,
	k.nodeWidth = 40,
	k.nodeHeight = 25,
	k.imageHeight = 10,
	k.imageWidth = 10
	k.centered,
	k.previousScale;
	
	k.redraw = function () {
		k.vis.attr("transform",
				"translate(" + d3.event.translate + ")"
				+ " scale(" + d3.event.scale + ")");
	}
	
	k.zoom = d3.behavior.zoom()
					.on("zoom", k.redraw)
					.scaleExtent([2, 8]);
					
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
			.attr("refX", 15)
			.attr("refY", -1.5)
			.attr("markerWidth", 6)
			.attr("markerHeight", 6)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");
	
	k.draw = function (json) {
		var force = d3.layout.force()
							.charge(-180)
							.linkDistance(50)
							.nodes(json.nodes)
							.links(json.links)
							.size([k.graphWidth, k.graphHeight])
							.start();
							
		var link = k.vis.selectAll("line.link")
							.data(json.links)
							.enter().append("svg:line")
							.attr("class", "link")
							.style("stroke-width", 0.4)
							.style("stroke", '#AAAAAA')
							.attr("marker-end", 'url(#arrow)')
							.attr("x1", function(d) { return d.source.x; })
							.attr("y1", function(d) { return d.source.y; })
							.attr("x2", function(d) { return d.target.x; })
							.attr("y2", function(d) { return d.target.y; });
							
		var node = k.vis.selectAll('svg.node')
							.data(json.nodes)
							.enter().append('svg:svg')
							.attr('height', k.nodeHeight)
							.attr('width', k.nodeWidth)
							.attr('x', -8)
							.attr('y', -8);
							
		node.append('image')
								.attr('xlink:href', 'http://graph.facebook.com/653499724/picture?type=small')
								.attr('class', 'node-image')
								.attr('x', 2)
								.attr('y', 2)
								.attr('width', k.imageWidth)
								.attr('height', k.imageHeight);
							
		node.append('svg:text')
							.attr('class', 'node-name')
							.text('Ravee Malla')
							.style('font-size', '3px')
							.style('font-weight', 'bold')
							.attr('x', 12)
							.attr('y', 5);
							
		node.append('foreignObject')
							.attr('class', 'node-comment')
							.attr('x', 12)
							.attr('y', 6)
							.attr('width', 20)
							.attr('height', 20)
							.append('xhtml:body')
							.style('color', '#333333')
							.style('line-height', '4px')
							.style('font-size', '2.5px')
							.html('<div style="width:20px;">I agree..</div>');
							
		
						
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
			
			if (k.centered) {
				$('.profile-image img').attr('src', 'http://graph.facebook.com/653499724/picture?type=small');
				$('.bio a').attr('href', '/konfrap/user/home/653499724');
				$('.bio a').html('Ravee Malla');
				$('.bio .side').html('speaking for the motion');
				$('.bio .score').html('10 points');
				$('.comment').html('I really feel we are missing the point here.');
			}
		};

		node.on('click', k.onClick);
		
		force.on("tick", function() {
			link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });
			
			node.attr("x", function(d) { return d.x; })
					.attr("y", function(d) { return d.y; });
					
		});
		
		
		
	};
	
	var data2 = {};
	data2['nodes'] = [{"name":"Myriel","group":1},{"name":"Napoleon","group":1},{"name":"Mlle.Baptistine","group":1},{"name":"Mme.Magloire","group":1},{"name":"CountessdeLo","group":1},{"name":"Geborand","group":1},{"name":"Champtercier","group":1}];
	
	data2['links'] = [{"source":1,"target":0,"value":1},{"source":2,"target":0,"value":8},{"source":3,"target":0,"value":10},{"source":4,"target":3,"value":6},{"source":5,"target":2,"value":1},{"source":6,"target":4,"value":1}];
	
	var data = {"nodes":[{"name":"Myriel","group":1},{"name":"Napoleon","group":1},{"name":"Mlle.Baptistine","group":1},{"name":"Mme.Magloire","group":1},{"name":"CountessdeLo","group":1},{"name":"Geborand","group":1},{"name":"Champtercier","group":1},{"name":"Cravatte","group":1},{"name":"Count","group":1},{"name":"OldMan","group":1},{"name":"Labarre","group":2},{"name":"Valjean","group":2},{"name":"Marguerite","group":3},{"name":"Mme.deR","group":2},{"name":"Isabeau","group":2},{"name":"Gervais","group":2},{"name":"Tholomyes","group":3},{"name":"Listolier","group":3},{"name":"Fameuil","group":3},{"name":"Blacheville","group":3},{"name":"Favourite","group":3},{"name":"Dahlia","group":3},{"name":"Zephine","group":3},{"name":"Fantine","group":3},{"name":"Mme.Thenardier","group":4},{"name":"Thenardier","group":4},{"name":"Cosette","group":5},{"name":"Javert","group":4},{"name":"Fauchelevent","group":0},{"name":"Bamatabois","group":2},{"name":"Perpetue","group":3},{"name":"Simplice","group":2},{"name":"Scaufflaire","group":2},{"name":"Woman1","group":2},{"name":"Judge","group":2},{"name":"Champmathieu","group":2},{"name":"Brevet","group":2},{"name":"Chenildieu","group":2},{"name":"Cochepaille","group":2},{"name":"Pontmercy","group":4},{"name":"Boulatruelle","group":6},{"name":"Eponine","group":4},{"name":"Anzelma","group":4},{"name":"Woman2","group":5},{"name":"MotherInnocent","group":0},{"name":"Gribier","group":0},{"name":"Jondrette","group":7},{"name":"Mme.Burgon","group":7},{"name":"Gavroche","group":8},{"name":"Gillenormand","group":5},{"name":"Magnon","group":5},{"name":"Mlle.Gillenormand","group":5},{"name":"Mme.Pontmercy","group":5},{"name":"Mlle.Vaubois","group":5},{"name":"Lt.Gillenormand","group":5},{"name":"Marius","group":8},{"name":"BaronessT","group":5},{"name":"Mabeuf","group":8},{"name":"Enjolras","group":8},{"name":"Combeferre","group":8},{"name":"Prouvaire","group":8},{"name":"Feuilly","group":8},{"name":"Courfeyrac","group":8},{"name":"Bahorel","group":8},{"name":"Bossuet","group":8},{"name":"Joly","group":8},{"name":"Grantaire","group":8},{"name":"MotherPlutarch","group":9},{"name":"Gueulemer","group":4},{"name":"Babet","group":4},{"name":"Claquesous","group":4},{"name":"Montparnasse","group":4},{"name":"Toussaint","group":5},{"name":"Child1","group":10},{"name":"Child2","group":10},{"name":"Brujon","group":4},{"name":"Mme.Hucheloup","group":8}],"links":[{"source":1,"target":0,"value":1},{"source":2,"target":0,"value":8},{"source":3,"target":0,"value":10},{"source":3,"target":2,"value":6},{"source":4,"target":0,"value":1},{"source":5,"target":0,"value":1},{"source":6,"target":0,"value":1},{"source":7,"target":0,"value":1},{"source":8,"target":0,"value":2},{"source":9,"target":0,"value":1},{"source":11,"target":10,"value":1},{"source":11,"target":3,"value":3},{"source":11,"target":2,"value":3},{"source":11,"target":0,"value":5},{"source":12,"target":11,"value":1},{"source":13,"target":11,"value":1},{"source":14,"target":11,"value":1},{"source":15,"target":11,"value":1},{"source":17,"target":16,"value":4},{"source":18,"target":16,"value":4},{"source":18,"target":17,"value":4},{"source":19,"target":16,"value":4},{"source":19,"target":17,"value":4},{"source":19,"target":18,"value":4},{"source":20,"target":16,"value":3},{"source":20,"target":17,"value":3},{"source":20,"target":18,"value":3},{"source":20,"target":19,"value":4},{"source":21,"target":16,"value":3},{"source":21,"target":17,"value":3},{"source":21,"target":18,"value":3},{"source":21,"target":19,"value":3},{"source":21,"target":20,"value":5},{"source":22,"target":16,"value":3},{"source":22,"target":17,"value":3},{"source":22,"target":18,"value":3},{"source":22,"target":19,"value":3},{"source":22,"target":20,"value":4},{"source":22,"target":21,"value":4},{"source":23,"target":16,"value":3},{"source":23,"target":17,"value":3},{"source":23,"target":18,"value":3},{"source":23,"target":19,"value":3},{"source":23,"target":20,"value":4},{"source":23,"target":21,"value":4},{"source":23,"target":22,"value":4},{"source":23,"target":12,"value":2},{"source":23,"target":11,"value":9},{"source":24,"target":23,"value":2},{"source":24,"target":11,"value":7},{"source":25,"target":24,"value":13},{"source":25,"target":23,"value":1},{"source":25,"target":11,"value":12},{"source":26,"target":24,"value":4},{"source":26,"target":11,"value":31},{"source":26,"target":16,"value":1},{"source":26,"target":25,"value":1},{"source":27,"target":11,"value":17},{"source":27,"target":23,"value":5},{"source":27,"target":25,"value":5},{"source":27,"target":24,"value":1},{"source":27,"target":26,"value":1},{"source":28,"target":11,"value":8},{"source":28,"target":27,"value":1},{"source":29,"target":23,"value":1},{"source":29,"target":27,"value":1},{"source":29,"target":11,"value":2},{"source":30,"target":23,"value":1},{"source":31,"target":30,"value":2},{"source":31,"target":11,"value":3},{"source":31,"target":23,"value":2},{"source":31,"target":27,"value":1},{"source":32,"target":11,"value":1},{"source":33,"target":11,"value":2},{"source":33,"target":27,"value":1},{"source":34,"target":11,"value":3},{"source":34,"target":29,"value":2},{"source":35,"target":11,"value":3},{"source":35,"target":34,"value":3},{"source":35,"target":29,"value":2},{"source":36,"target":34,"value":2},{"source":36,"target":35,"value":2},{"source":36,"target":11,"value":2},{"source":36,"target":29,"value":1},{"source":37,"target":34,"value":2},{"source":37,"target":35,"value":2},{"source":37,"target":36,"value":2},{"source":37,"target":11,"value":2},{"source":37,"target":29,"value":1},{"source":38,"target":34,"value":2},{"source":38,"target":35,"value":2},{"source":38,"target":36,"value":2},{"source":38,"target":37,"value":2},{"source":38,"target":11,"value":2},{"source":38,"target":29,"value":1},{"source":39,"target":25,"value":1},{"source":40,"target":25,"value":1},{"source":41,"target":24,"value":2},{"source":41,"target":25,"value":3},{"source":42,"target":41,"value":2},{"source":42,"target":25,"value":2},{"source":42,"target":24,"value":1},{"source":43,"target":11,"value":3},{"source":43,"target":26,"value":1},{"source":43,"target":27,"value":1},{"source":44,"target":28,"value":3},{"source":44,"target":11,"value":1},{"source":45,"target":28,"value":2},{"source":47,"target":46,"value":1},{"source":48,"target":47,"value":2},{"source":48,"target":25,"value":1},{"source":48,"target":27,"value":1},{"source":48,"target":11,"value":1},{"source":49,"target":26,"value":3},{"source":49,"target":11,"value":2},{"source":50,"target":49,"value":1},{"source":50,"target":24,"value":1},{"source":51,"target":49,"value":9},{"source":51,"target":26,"value":2},{"source":51,"target":11,"value":2},{"source":52,"target":51,"value":1},{"source":52,"target":39,"value":1},{"source":53,"target":51,"value":1},{"source":54,"target":51,"value":2},{"source":54,"target":49,"value":1},{"source":54,"target":26,"value":1},{"source":55,"target":51,"value":6},{"source":55,"target":49,"value":12},{"source":55,"target":39,"value":1},{"source":55,"target":54,"value":1},{"source":55,"target":26,"value":21},{"source":55,"target":11,"value":19},{"source":55,"target":16,"value":1},{"source":55,"target":25,"value":2},{"source":55,"target":41,"value":5},{"source":55,"target":48,"value":4},{"source":56,"target":49,"value":1},{"source":56,"target":55,"value":1},{"source":57,"target":55,"value":1},{"source":57,"target":41,"value":1},{"source":57,"target":48,"value":1},{"source":58,"target":55,"value":7},{"source":58,"target":48,"value":7},{"source":58,"target":27,"value":6},{"source":58,"target":57,"value":1},{"source":58,"target":11,"value":4},{"source":59,"target":58,"value":15},{"source":59,"target":55,"value":5},{"source":59,"target":48,"value":6},{"source":59,"target":57,"value":2},{"source":60,"target":48,"value":1},{"source":60,"target":58,"value":4},{"source":60,"target":59,"value":2},{"source":61,"target":48,"value":2},{"source":61,"target":58,"value":6},{"source":61,"target":60,"value":2},{"source":61,"target":59,"value":5},{"source":61,"target":57,"value":1},{"source":61,"target":55,"value":1},{"source":62,"target":55,"value":9},{"source":62,"target":58,"value":17},{"source":62,"target":59,"value":13},{"source":62,"target":48,"value":7},{"source":62,"target":57,"value":2},{"source":62,"target":41,"value":1},{"source":62,"target":61,"value":6},{"source":62,"target":60,"value":3},{"source":63,"target":59,"value":5},{"source":63,"target":48,"value":5},{"source":63,"target":62,"value":6},{"source":63,"target":57,"value":2},{"source":63,"target":58,"value":4},{"source":63,"target":61,"value":3},{"source":63,"target":60,"value":2},{"source":63,"target":55,"value":1},{"source":64,"target":55,"value":5},{"source":64,"target":62,"value":12},{"source":64,"target":48,"value":5},{"source":64,"target":63,"value":4},{"source":64,"target":58,"value":10},{"source":64,"target":61,"value":6},{"source":64,"target":60,"value":2},{"source":64,"target":59,"value":9},{"source":64,"target":57,"value":1},{"source":64,"target":11,"value":1},{"source":65,"target":63,"value":5},{"source":65,"target":64,"value":7},{"source":65,"target":48,"value":3},{"source":65,"target":62,"value":5},{"source":65,"target":58,"value":5},{"source":65,"target":61,"value":5},{"source":65,"target":60,"value":2},{"source":65,"target":59,"value":5},{"source":65,"target":57,"value":1},{"source":65,"target":55,"value":2},{"source":66,"target":64,"value":3},{"source":66,"target":58,"value":3},{"source":66,"target":59,"value":1},{"source":66,"target":62,"value":2},{"source":66,"target":65,"value":2},{"source":66,"target":48,"value":1},{"source":66,"target":63,"value":1},{"source":66,"target":61,"value":1},{"source":66,"target":60,"value":1},{"source":67,"target":57,"value":3},{"source":68,"target":25,"value":5},{"source":68,"target":11,"value":1},{"source":68,"target":24,"value":1},{"source":68,"target":27,"value":1},{"source":68,"target":48,"value":1},{"source":68,"target":41,"value":1},{"source":69,"target":25,"value":6},{"source":69,"target":68,"value":6},{"source":69,"target":11,"value":1},{"source":69,"target":24,"value":1},{"source":69,"target":27,"value":2},{"source":69,"target":48,"value":1},{"source":69,"target":41,"value":1},{"source":70,"target":25,"value":4},{"source":70,"target":69,"value":4},{"source":70,"target":68,"value":4},{"source":70,"target":11,"value":1},{"source":70,"target":24,"value":1},{"source":70,"target":27,"value":1},{"source":70,"target":41,"value":1},{"source":70,"target":58,"value":1},{"source":71,"target":27,"value":1},{"source":71,"target":69,"value":2},{"source":71,"target":68,"value":2},{"source":71,"target":70,"value":2},{"source":71,"target":11,"value":1},{"source":71,"target":48,"value":1},{"source":71,"target":41,"value":1},{"source":71,"target":25,"value":1},{"source":72,"target":26,"value":2},{"source":72,"target":27,"value":1},{"source":72,"target":11,"value":1},{"source":73,"target":48,"value":2},{"source":74,"target":48,"value":2},{"source":74,"target":73,"value":3},{"source":75,"target":69,"value":3},{"source":75,"target":68,"value":3},{"source":75,"target":25,"value":3},{"source":75,"target":48,"value":1},{"source":75,"target":41,"value":1},{"source":75,"target":70,"value":1},{"source":75,"target":71,"value":1},{"source":76,"target":64,"value":1},{"source":76,"target":65,"value":1},{"source":76,"target":66,"value":1},{"source":76,"target":63,"value":1},{"source":76,"target":62,"value":1},{"source":76,"target":48,"value":1},{"source":76,"target":58,"value":1}]};
	
	k.draw(data2);
};

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
	k.initGraph();
});
