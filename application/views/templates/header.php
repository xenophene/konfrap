<div id="header">
  <span class="logo"><?php echo anchor('user', 'konϝrap');?></span>
  <span class="search">
    <ul class="header-ul">
      <li class="search-form ui-front">
        <input class="navbar-search hide" type="text" id="friend-search"
               data-provide="typeahead" placeholder="Search" autocomplete="off"/>
        <div class="icon-search icon-black hide"></div>
      </li>
    </ul>
  </span>
  <span class="options">
    <ul class="header-ul hover-bg">
      <li><?php echo anchor('contact/join_us', 'Join Us',   array('id' => 'ju'));?></li>
      <li><?php echo anchor('contact/about', 'About',       array('id' => 'ab'));?></li>
      <li><?php echo anchor('contact/feedback', 'Feedback', array('id' => 'fb'));?></li>
      
      <?php if ($signed_in): /** show the signedin search box */?>
      
      <li><?php echo anchor('user/home', 'Home');?></li>
      <li><?php echo anchor('user/logout', 'Logout');?></li>
      
      <?php else: ?>
      <li><?php echo anchor($loginUrl, 'Login');?></li>
      
      <?php endif; ?>
    </ul>
  </span>
</div>
