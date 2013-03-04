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
  <table class="details">
    <tbody>
      <tr>
        <td><span id="debating-points" class="interest">debating points:</span></td>
        <td class="debate-score"><?php echo $user_profile['score']; ?></td>
      </tr>
      <tr>
        <td class="contain-interest"><span id="interested-in" class="interest">interested in:</span></td>
        <td name="<?php echo $user_profile['fbid'];?>" class="interest-elements">
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

<div id="start-debate-form" class="modal hide fade well">
  <div class="modal-header">
    <button type="button" id="cancel-debate" class="close"
            data-dismiss="modal">x</button>
    <h1>Start a new debate</h1>
  </div>
  <div class="modal-body">
    <form>
      <input type="text" title="Debate's Topic" name="debate-topic"
             id="debate-topic" class="input-xxlarge" placeholder="Debate Topic" autocomplete="off"/>
      <textarea class="input-xxlarge" title="Debate's Description"
                name="debate-desc" id="debate-desc" placeholder="Debate Description"
                rows="4" autocomplete="off"></textarea>
      <input type="text" name="debate-theme" title="Debate's Themes"
             id="debate-theme" class="input-xxlarge" placeholder="Debate Themes"
             autocomplete="off" spellcheck="false"/>
      <input type="text" name="participants" title="Debate's Participants"
             id="participants" class="input-xxlarge ui-autocomplete-input"
             placeholder="Challenge Friends" autocomplete="off" spellcheck="false"/>
      <input type="hidden" name="participant-ids" title="Debate's Participants"
             id="participant-ids"/>
      <div id="radio2" title="Set the debate privacy">
        <input type="radio" id="privacy-1" name="privacy" value="0"
               checked="checked" /><label for="privacy-1">Public Debate</label>
        <input type="radio" id="privacy-2" name="privacy" value="1" />
        <label for="privacy-2">Private Debate</label>
      </div>
      <button type="submit" class="btn btn-primary" id="start-debate">Start</button>
      <img src="/konfrap/assets/img/loading3.gif" alt="Loading"
           class="hide" id="start-loading" title="Loading"/>
    </form>
  </div>
</div>