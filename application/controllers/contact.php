<?php

/**
 * Contact controller
 */

class Contact extends CI_Controller {
  public function __construct() {
    parent::__construct();
    $this->load->model('facebook_model');
    $this->load->model('contact_model');
    $this->load->helper('url');
    $this->load->helper('html');
  }
  
  public function join_us() {
    $fb = $this->session->userdata('fb');
    $data['signed_in'] = ($fb['me'] != null) and $fb['fbid'];
    $data['name'] = 'Join Us';
		$data['loginUrl'] = $fb['loginUrl'];
		
    $this->load->view('templates/prologue', $data);
    $this->load->view('templates/header', $data);
    $this->load->view('contact/join_us');
    $this->load->view('contact/contact_js');
    $this->load->view('templates/footer', $data);
  }
  
  public function about() {
    $fb = $this->session->userdata('fb');
    $data['signed_in'] = ($fb['me'] != null) and $fb['fbid'];
    $data['name'] = 'About';
		$data['loginUrl'] = $fb['loginUrl'];
		
    $this->load->view('templates/prologue', $data);
    $this->load->view('templates/header', $data);
    $this->load->view('contact/about');
    $this->load->view('contact/contact_js');
    $this->load->view('templates/footer', $data);
  }
  
  public function feedback() {
    $fb = $this->session->userdata('fb');
    
    $email = $this->input->post('email');
    $feedback = $this->input->post('feedback');
		if ($email and $feedback) {
			$this->contact_model->add_feedback($email, $feedback);
		}
		
    $data['signed_in'] = ($fb['me'] != null) and $fb['fbid'];
    $data['name'] = 'Feedback';
		$data['loginUrl'] = $fb['loginUrl'];
		
    $this->load->view('templates/prologue', $data);
    $this->load->view('templates/header', $data);
		$this->load->view('contact/feedback');
    
    $this->load->view('contact/contact_js');
    $this->load->view('templates/footer', $data);
  }
  
}