<?php

class Comments extends CI_Controller {
  public function __construct() {
    parent::__construct();
    $this->load->model('debate_model');
    $this->load->model('comment_model');
  }
  
  /*
   * return the comments of the debate with id ID
   */
  public function by_debate($id) {
    $comments = $this->comment_model->get_comments_from_debate_id($id);
    echo json_encode($comments);
  }
}