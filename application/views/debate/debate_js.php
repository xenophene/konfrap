<script>
  <?php echo "
    var myfbid = '$myfbid';
    var debid = '$id';
    var signed_in = '$signed_in';
    var participantIds = ". json_encode($participants) .";
    var followerIds = ". json_encode($followers) .";
  ";
  ?>
</script>
<script src="/konfrap/assets/js/jquery-1.7.2.min.js"></script>
<script src="/konfrap/assets/js/bootstrap.min.js"></script>
<script src="/konfrap/assets/js/jquery-ui-min.js"></script>
<script src="/konfrap/assets/js/bootstrap-editable.min.js"></script>
<script src="/konfrap/assets/js/tag-it-min.js"></script>
<script src="/konfrap/assets/js/common.js"></script>
<script src="/konfrap/assets/js/debate.js"></script>