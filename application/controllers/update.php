<?php

class Update extends CI_Controller{
	public function __construct(){
		parent::__construct();
		
		$this->load->model('facebook_model');
		$this->load->model('user_model');
		$this->load->model('update_model');
		$this->load->helper('url');
		$this->load->helper('html');
		
	}
/* Creates update of the type and return the id if successful
 */

	public function create($fb, $target, $type){
		$fb = $this->session->userdata('fb');
		$target = $this->post('target');
		$type = $this->post('type');
		
		$source = $fb['fbid'];
		if($fb['fbid']){
			$id = $this->update_model->create_update($source,$type,$target);
			echo $id;
		}
		else
			echo 0;
	}

/* Returns updates to be shown on the home page of the users.
 * Algorithm of updates can be improved later.
 */
	public function my_friends() {
    $fb = $this->session->userdata('fb');
    if ($fb['fbid']) {
      try {
        $access_token = $this->facebook->getAccessToken();
        $friends = $this->facebook->api('/me/friends', 'GET');
        //return json_encode($friends);
				$friends_array = array();
				foreach($friends['data'] as $friend){
					array_push($friends_array,$friend['id']);
				}
				return $friends_array;
      } catch (FacebookApiException $e) {}
    }
	}
	
	/*returns the updates relavant to the given $fbid
	 *return updates for current logged in if $fbid not given
	 */
	public function index($fbid=null){
		$fb = $this->session->userdata('fb');
		if(!$fbid and $fb['fbid']) 
			$fbid = $fb['fbid'];
		else{
			
			$fbid = -1;
			return;
		}
		
		$followers = $this->user_model->get_followers($fbid);
		$friends = $this->my_friends();
		$connections = array_merge($followers,$friends);
		
		$updates = array();
		$updates = $this->update_model->get_updates(implode(',',$connections));
		echo $updates;
		return $updates;
	}

	public function get_feeds(){
		
	}
	
}

?>