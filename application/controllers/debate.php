<?php

class Debate extends CI_Controller {
  public function __construct() {
    parent::__construct();
    $this->load->model('facebook_model');
    $this->load->model('user_model');
    $this->load->model('debate_model');
    $this->load->helper('url');
    $this->load->helper('html');
  }
  
  /**
   * create debate function. verifies permission to create debate and sets it
   * up
   */
  public function create() {
    $fb = $this->session->userdata('fb');
    $debate_topic = $this->input->post('debate-topic');
    $debate_description = $this->input->post('debate-description');
    
    $debate_themes = explode(',', $this->input->post('debate-themes'));
    $participant_ids = explode(',', $this->input->post('participant-ids'));
    $claimed_fbid = $this->input->post('myfbid');
    if ($fb['fbid'] and $claimed_fbid === $fb['fbid'] and $debate_topic !== ''
        and $debate_description !== '') {
      $id = $this->debate_model->create_debate($debate_topic, $debate_description,
                                         $fb['fbid'], $debate_themes,
                                         $participant_ids);
      echo $id;
    } else {
      echo '0';
    }
  }
  
  public function index($id = FALSE) {
    if ( ! $id) {
      redirect('/user');
    }
    $debate = $this->debate_model->get_by_id($id);
    if (empty($debate)) {
      redirect('/user');
    }
    $fb = $this->session->userdata('fb');
    $data['loginUrl'] = $fb['loginUrl'];
    $signed_in = ($fb['me'] != null) and $fb['fbid'];
    $data['signed_in'] = $signed_in;
    $data['name'] = $debate['topic'];
    
    $this->load->view('templates/prologue', $data);
    $this->load->view('templates/header', $data);
    
    $data['topic'] = $debate['topic'];
    $data['id'] = $debate['id'];
    $data['description'] = $debate['description'];
    $data['themes'] = $this->debate_model->get_themes($id);
    $data['creator'] = $debate['creator_fbid'];
    $data['score'] = $debate['score'];
    $data['followers'] = $this->debate_model->get_followers($id);
    $data['num_followers'] = sizeof($data['followers']);
    if (in_array($fb['fbid'], $data['followers'])) {
      $data['fclass'] = 'btn-danger';
      $data['ftext'] = 'Unfollow';
    } else {
      $data['fclass'] =  'btn-primary';
      $data['ftext'] = 'Follow';
    }
    $data['participants'] = $this->debate_model->get_participants($id);
    $data['is_participant'] = in_array($fb['fbid'], $data['participants']);
    
    $time = strtotime($debate['startdate']);
    $data['time'] = date('j F Y', $time);
    
    $this->load->view('debate/debate', $data);
    
    $data['myfbid'] = $fb['fbid'];
    $this->load->view('debate/debate_js', $data);
    $this->load->view('templates/footer', $data);
  }
  
  public function add_theme() {
    $id = $this->input->post('id');
    $val = $this->input->post('val');
    $fb = $this->session->userdata('fb');
    if ($fb['fbid'] and $id and $val) {
      $this->debate_model->set_theme($id, $val);
    }
  }
  public function remove_theme() {
    $id = $this->input->post('id');
    $val = $this->input->post('val');
    $fb = $this->session->userdata('fb');
    if ($fb['fbid'] and $id and $val) {
      $this->debate_model->unset_theme($id, $val);
    }
  }
  
  public function all() {
    $users = $this->debate_model->get_debates();
    $response = array();
    foreach ($users as $user) {
      array_push($response, array(
                              'name'    =>  $user['topic'],
                              'id'      =>  $user['id'],
                              'ltype'   =>  'd'
                            )
                );
    }
    echo json_encode($response);
  }
  
  public function edit_field() {
    $id = $this->input->post('pk');
    $name = $this->input->post('name');
    $value = $this->input->post('value');
    $fb = $this->session->userdata('fb');
    if ($fb['fbid'] and $id and $name and $value and $value !== '') {
      $this->debate_model->edit_field($id, $name, $value);
    }
  }
  
  public function invite_friends() {
    $inviter_id = $this->input->post('inviterId');
    $debate_id = $this->input->post('id');
    $invites = explode(',', $this->input->post('friendList'));
    
    $this->debate_model->set_invites($inviter_id, $debate_id, $invites);
  }
  
  public function unfollow() {
    $follower_fbid = $this->input->post('follower');
    $id = $this->input->post('debate_id');
    
    $this->debate_model->unset_follower($id, $follower_fbid);
  }
  
  public function follow() {
    $follower_fbid = $this->input->post('follower');
    $id = $this->input->post('debate_id');
    
    $this->debate_model->set_follower($id, $follower_fbid);
  }
  
  public function parse_page($page_url) {
    
    
    
    /* Experiment with different main stream news Sources.
    $page_url = "http://www.thehindu.com/opinion/lead/the-silent-war-over-education-reforms/article4570580.ece";
    $page_url = "http://localhost/iitdebates/page.html";
    $page_url = "http://localhost/iitdebates/page1.html";
    $page_url = "http://localhost/iitdebates/page2.html";
    $page_url = "http://localhost/iitdebates/page3.html";          
    */
    //$page_url = $this->input->post('url');
    $page_url = "http://localhost/iitdebates/page5.html";
    $data= $this->debate_model->parse_page($page_url);
    print_r($data);
    
  }

}