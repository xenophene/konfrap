<?php echo "
  <script>
    var myfbid = '$myfbid';
    var ufbid = '". $user_profile['fbid'] ."';
    var uname = '". $user_profile['name'] ."';
    var uuid = '". $user_profile['id'] ."';
    var followers = ". json_encode($followers) ."
    var followees = ". json_encode($followees) ."
  </script>
  ";
?>
</script>
<script src="/konfrap/assets/js/jquery-1.7.2.min.js"></script>
<script src="/konfrap/assets/js/bootstrap.min.js"></script>
<script src="/konfrap/assets/js/jquery-ui-min.js"></script>
<script src="/konfrap/assets/js/jquery.editinplace.js"></script>
<script src="/konfrap/assets/js/tag-it-min.js"></script>
<script src="/konfrap/assets/js/common.js"></script>
<script src="/konfrap/assets/js/home.js"></script>