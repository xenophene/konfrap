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
  
  public function index($id = null) {
    if ( ! $id) {
      redirect('/user');
    }
    $debate = $this->debate_model->get_by_id($id);
    if (empty($debate)) {
      redirect('/user');
    }
    $fb = $this->session->userdata('fb');
    $signed_in = ($fb['me'] != null) and $fb['fbid'];
    $data['signed_in'] = $signed_in;
    $data['name'] = $debate['topic'];
    $this->load->view('templates/prologue', $data);
    $this->load->view('templates/header', $data);
    $this->load->view('debate/debate_js', $data);
    $this->load->view('templates/footer', $data);
  }
}