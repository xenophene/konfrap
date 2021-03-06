<?php

class Update extends CI_Controller {
  
	public function __construct() {
    parent::__construct();
    $this->load->model('facebook_model');
    $this->load->model('user_model');
    $this->load->model('debate_model');
		$this->load->model('update_model'); 
		$this->load->helper('url');
    $this->load->helper('html');
  }

	public function index($uid){
		$updates = $this->update_model->get_by_id($uid);
		return $updates;
	}
	
	public function all(){
		return $this->update_model->get_all();
	}

}