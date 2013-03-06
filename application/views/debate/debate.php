<div id="main">
  <div id="prominent">
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
            echo anchor('user/home/'. $creator .'2',
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
    
  </div>
</div>