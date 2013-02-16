<div id="profile">
  <a href="<?php echo 'user/home/'. $user_profile['fbid']; ?>">
    <img class="pic" src="<?php echo '//graph.facebook.com/'. $user_profile['fbid'] .'/picture?type=normal';?>"/>
  </a>
  <table class="name-table">
    <thead>
      <tr><td class="name"><?php echo $name;?></td></tr>
    </thead>
  </table>
  <table class="details">
    <tbody>
      <tr>
        <td class="contain-interest"><span id="interested-in" class="interest">interested in:</span></td>
        <?php $editable = $me ? 'editable' : '';?>
        <td name="<?php echo $user_profile['fbid'];?>" class="interest-elements <?php echo $editable;?>">
          <?php echo implode(',', $interests); ?>
        </td>
      </tr>
      <tr>
        <td><span id="debating-points" class="interest">debating points:</span></td>
        <td class="debate-score"><?php echo $user_profile['score']; ?></td>
      </tr>
    </tbody>
  </table>
  <div class="engage">
  <?php if ($me): ?>
    <a title="Start a New debate" id="start" class="btn btn-primary usr-engage-btn">Start a new debate</a><br/>
    <a title="View my followers" id="my-followers" class="btn usr-engage-btn">My Followers</a><br/>
    <a title="View my followees" id="my-followees" class="btn usr-engage-btn">My Followees</a>
  <?php elseif ($signed_in):
    if (!in_array($myfbid, $followers)) {
      $fclass = 'btn btn-primary';
      $ftext = 'Follow';
    } else {
      $fclass = 'btn btn-danger';
      $ftext = 'Unfollow';
    }
  ?>
    <a title="Follow this user's activity" id="follow" class="<?php echo $fclass;?>"><?php echo $ftext;?></a><br/>
    <a title="Challenge to a debate" id="challenge" class="btn usr-engage-btn2">Challenge</a>
  <?php endif; ?>
  </div>
</div>