<div id="main">
  <div id="prominent">
    <a href="<?php echo '/konfrap/user/home/'. $user_profile['fbid']; ?>">
      <img class="pic" src="<?php echo '//graph.facebook.com/'.
      $user_profile['fbid'] .'/picture?type=normal';?>"/>
    </a>
    <table class="name-table">
      <thead>
        <tr><td class="name"><?php echo $name;?></td></tr>
      </thead>
    </table>
    <table>
      <tbody>
        <tr>
          <td class="contain-interest"><span id="interested-in" class="details">interested in:</span></td>
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
         class="btn btn-primary usr-engage-btn">Start a new debate</a><br/>
      <a title="View my followers" id="my-followers" class="btn usr-engage-btn">My Followers</a><br/>
      <a title="View my followees" id="my-followees" class="btn usr-engage-btn">My Followees</a>
    <?php elseif ($signed_in): ?>
      <a title="Follow this user's activity" id="follow"
         class="btn <?php echo $fclass;?>"><?php echo $ftext;?></a><br/>
      <a title="Challenge to a debate" id="challenge"
         class="btn usr-engage-btn2">Challenge</a>
    <?php endif; ?>
    </div>
  </div>
  
  <div class="updates">
    <h3>Updates</h3>
    <?php foreach ($updates as $update): ?>
    <div class="update">
      <div class="heading"><?php echo $update['heading'];?></div>
      <div class="body"><?php echo $update['body'];?></div>
    </div>
    <?php endforeach; ?>
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
        
        <button type="submit" class="btn btn-primary" id="start-debate">Start</button>
        <img src="/konfrap/assets/img/loading3.gif" alt="Loading"
             class="hide" id="start-loading" title="Loading"/>
      </form>
    </div>
  </div>
</div>
</div>