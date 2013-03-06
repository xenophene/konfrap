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
  </div>
</div>