<?php

class Facebook_model extends CI_Model {
  public function __construct() {
    parent::__construct();
    $user = $this->facebook->getUser();
    
    $user_profile = null;
    
    if ($user) {
      try {
        $user_profile = $this->facebook->api('/me');
      } catch (FacebookApiException $e) {
        $user = null;
      }
    }
    
    $fb = array(
      'me'        =>  $user_profile,
      'fbid'      =>  $user,
      'loginUrl'  =>  $this->facebook->getLoginUrl(),
      'logoutUrl' =>  $this->facebook->getLogoutUrl(array(
                                                      'next'  =>  DOMAIN
                                                    ))
    );
    
    $this->session->set_userdata('fb', $fb);
  }
}