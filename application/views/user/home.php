<div id="main">
  <div id="prominent">
    <a href="<?php echo '/konfrap/user/home/'. $user_profile['fbid']; ?>">
      <img class="pic" src="//graph.facebook.com/<?php echo $user_profile['fbid'];?>/picture?type=normal"/>
    </a>
    <table class="name-table">
      <thead>
        <tr><td class="name"><?php echo $name;?></td></tr>
      </thead>
    </table>
    <table>
      <tbody>
        <tr>
          <td name="<?php echo $user_profile['fbid'];?>" class="tag-elements">
            <ul title="Interest Tags" id="interest-tags">
              <?php foreach ($interests as $interest): ?>
              <li>
                <span><?php echo $interest;?></span>
              </li>
              <?php endforeach; ?>
              <?php if (empty($interests) and !$me): ?>
              <em>no interests added</em>
              <?php endif; ?>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="engage">
    <?php if ($me): ?>
      <a title="Start a New debate" id="start"
         class="btn btn-custom usr-engage-btn">Start a new debate</a><br/>
      <a title="View my followers" id="my-followers" class="btn usr-engage-btn">My Followers</a><br/>
      <a title="View my followees" id="my-followees" class="btn usr-engage-btn">My Followees</a>
    <?php elseif ($signed_in): ?>
      <a title="Follow this user's activity" id="follow"
         class="btn <?php echo $fclass;?>"><?php echo $ftext;?></a><br/>
      <a title="Challenge to a debate" id="challenge"
         class="btn btn-custom usr-engage-btn2">Challenge</a><br/>
      <a title="View Followers" id="my-followers"
         class="btn usr-engage-btn2">Followers</a>
    <?php endif; ?>
    </div>
  </div>
  <div class="home-body">
    <ul class="nav nav-pills user-tabs">
      <li class="active"><a href="#updates" data-toggle="pill">
        <?php if (!$me) echo $myname;?> Updates
      </a></li>
      <li><a href="#my-debates" data-toggle="pill"><?php echo $myname;?> Debates</a></li>
      <?php if ($me): ?>
      <li><a href="#popular-debates" data-toggle="pill">Popular Debates</a></li>
      <?php endif; ?>
    </ul>
    
    <div class="tab-content">
      <div class="tab-pane active feed-list" id="updates">
        
      </div>
      <div class="tab-pane feed-list" id="my-debates">
      <?php if (empty($my_debates)): ?>
        <div class="feed-block">
          <div class="heading">
            No debates followed.
          </div>
        </div>
      <?php endif; ?>
      <?php foreach ($my_debates as $my_debate): ?>
        <div class="feed-block" id="<?php echo $my_debate['id'];?>">
          <div class="heading">
            <?php echo anchor('debate/' . $my_debate['id'],
                              $my_debate['topic']);
            ?>
          </div>
          <div class="body">
            <?php echo $my_debate['description'];?>
          </div>
          <div class="row footer">
            <div class="span2"><i class="icon-signal"></i> <?php echo $my_debate['score'];?> points</div>
            <?php if ($me): ?>
            <div class="span2 delete-debate pointer"><i class="icon-remove"></i> Remove</div>
            <?php endif; ?>
            <div class="span3"><i class="icon-user"></i>
            <?php
              echo anchor('user/home/' . $my_debate['creator_fbid'],
                          $my_debate['creator_fbid'],
                          array('class' =>  'resolve', 'title' =>  'Creator'));
            ?>
            </div>
            
          </div>
        </div>
        <?php endforeach; ?>
      </div>
      <div class="tab-pane feed-block" id="popular-debates">
        
      </div>
    </div>
  </div>
  
  <div id="start-debate-form" class="modal hide">
    <div class="modal-header">
      <button type="button" id="cancel-debate" class="close"
              data-dismiss="modal">x</button>
      <h1>Start a new debate</h1>
    </div>
    <div class="modal-body">
      <form>
        <input type="text" title="Debate's Topic" name="debate-topic"
               id="debate-topic" class="outline input-xxlarge"
               placeholder="Debate Topic" autocomplete="off"/>
        <textarea class="outline input-xxlarge" title="Debate's Description"
                  name="debate-desc" id="debate-desc" placeholder="Debate Description"
                  rows="4" autocomplete="off"></textarea>
        
        <ul class="outline" id="debate-theme" title="Debate Themes"></ul>
        <ul class="outline" id="participants" title="Debate's Participants"></ul>
        
        <input type="hidden" name="participant-names" id="participant-names"/>
        <input type="hidden" name="participant-ids" title="Debate's Participants"
               id="participant-ids"/>
        
        <button type="submit" class="btn btn-custom" id="start-debate">Start</button>
        <img src="/konfrap/assets/img/loading3.gif" alt="Loading"
             class="hide" id="start-loading" title="Loading"/>
      </form>
    </div>
  </div>
</div>