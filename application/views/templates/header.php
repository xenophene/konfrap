<div id="header">
  <span class="logo"><?php echo anchor('user', 'Confrap');?></span>
  <span class="fb-ju-ab">
    <ul>
      <li><?php echo anchor('contact/join_us', 'Join Us',   array('id' => 'ju'));?></li>
      <li><?php echo anchor('contact/about', 'About',       array('id' => 'ab'));?></li>
      <li><?php echo anchor('contact/feedback', 'Feedback', array('id' => 'fb'));?></li>
    </ul>
  </span>
  <span class="options">
    <ul>
      <?php if ($signed_in): /** show the signedin search box */?>
      <li class="search-form">
        <input class="navbar-search" type="text" id="friend-search"
               data-provide="typeahead" placeholder="Search" autocomplete="off"/>
        <div class="icon-search icon-black"></div>
      </li>
      <li class="top-right-link"><?php echo anchor('user/home', 'Home');?></li>
      <li class="top-right-link"><?php echo anchor('user/logout', 'Logout');?></li>
      
      <?php else: ?>
      <li class="top-right-link"><?php echo anchor('user/login', 'Login');?></li>
      
      <?php endif; ?>
    </ul>
  </span>
</div>