<?php

class Debate_model extends CI_Model {
  public function __construct() {
    $this->load->database();
  }
  
  public function add_followers($debate_id, $followers) {
    $data = array(
              'debate_id'   =>  $debate_id
            );
    
    if (is_array($followers)) {
      foreach ($followers as $follower) {
        $data['follower_fbid'] = $follower;
        $query = $this->db->insert('debate_followers', $data);
      }
    } else {
      $data['follower_fbid'] = $followers;
      $query = $this->db->insert('debate_followers', $data);
    }
    
  }
  
  public function add_themes($debate_id, $themes) {
    $data = array(
              'debate_id'   =>  $debate_id
            );
    
    if (is_array($themes)) {
      foreach ($themes as $theme) {
        $data['theme'] = $theme;
        $query = $this->db->insert('debate_themes', $data);
      }
    } else {
      $data['theme'] = $themes;
      $query = $this->db->insert('debate_themes', $data);
    }
  }
  
  public function set_debate_token($debate_id, $token) {
    $data = array(
              'debate_id'   =>  $debate_id
            );
    $data['token'] = $token;
    $query = $this->db->insert('debate_tokens', $data);
  }
  
  
  public function create_debate($topic, $description, $creator, $themes,
                                $followers) {
    $data = array(
              'topic'         =>  $topic,
              'description'   =>  $description,
              'creator_fbid'  =>  $creator,
              'startdate'     =>  date('Y-m-d H:i:s')
            );
    
    $query = $this->db->insert('debates', $data);
    $id = $this->db->insert_id();
    $this->add_followers($id, $followers);
    $this->add_followers($id, $creator);
    $this->add_themes($id, $themes);
    $this->set_debate_token($id, 0);
    return $id;
  }
  
  public function get_by_id($id) {
    $query = $this->db->get_where('debates', array('id'   =>  $id));
    return $query->row_array();
  }
}