<?php

class Contact_model extends CI_Model {
  public function __construct() {
    $this->load->database();
  }
  public function add_feedback($email, $feedback) {
    if ( ! $email or ! $feedback) {
      return;
    }
    $data = array(
      'email'     =>  $email,
      'feedback'  =>  $feedback
    );
    $this->db->insert('feedback', $data);
  }
}