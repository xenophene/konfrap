<div id="prominent" class="row-fluid">
  <div id="debate-details">
    <div class="topic editable" name="<?php echo $id;?>">
      <?php echo $topic;?>
    </div>
    <div class="desc editable" name="<?php echo $id;?>">
      <?php echo $description;?>
    </div>
    <div class="deb-themes">
      <ul title="Theme tags" id="theme-tags">
        <?php foreach ($themes as $theme): ?>
        <li>
          <span><?php echo $theme;?></span>
        </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>
  
  <table class="d-details">
    <tbody>
      <tr>
        <td><span class="stats">Created by:</span></td>
        <td>
          <?php
          echo anchor('user/home/'. $creator,
                      '<span class="resolve">' . $creator . '</span>');
          ?>
        </td>
      </tr>
      <tr>
        <td><span class="stats"># Followers:</span></td>
        <td><?php echo $num_followers;?></td>
      </tr>
      <tr>
        <td><span class="stats">Created:</span></td>
        <td><?php echo $time;?></td>
      </tr>
      
      <tr>
        <td><span class="stats">Debate Points:</span></td>
        <td><?php echo $score;?></td>
      </tr>
      
    </tbody>
  </table>
  
  <div class="engage">
    <?php if ($signed_in): ?>
    
    <a title="Follow Debate" id="follow-debate" class="btn <?php echo $fclass;?> engage-btn">
    <?php echo $ftext;?></a><br/>
    <a title="Invite friends to this debate" id="invite-to-debate"
       class="btn btn-konfrap engage-btn">Invite Friends</a><br/>
    
    <?php else: ?>
    <a href="<?php echo $loginUrl; ?>" class="btn btn-konfrap engage-btn">Sign in</a><br/>
    
    <?php endif; ?>
    
    <a title="See all participants" id="view-participants" class="btn engage-btn">Participants</a><br/>
    <a title="See all followers" id="view-followers" class="btn engage-btn">Followers</a>
  </div>
</div>