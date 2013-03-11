<?php

class Debate_model extends CI_Model {
  public function __construct() {
    $this->load->database();
  }
  
  public function get_debates() {
    $query = $this->db->get('debates');
    return $query->result_array();
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
  
  public function set_theme($id, $val) {
    $data = array(
            'debate_id'   =>  $id,
            'theme'       =>  $val
          );
    
    $query = $this->db->insert('debate_themes', $data);
  }
  
  public function unset_theme($id, $val) {
    $data = array(
            'debate_id'   =>  $id,
            'theme'       =>  $val
          );
    
    $query = $this->db->delete('debate_themes', $data);
  }
  
  public function get_themes($id) {
    $this->db->select('theme');
    $query = $this->db->get_where('debate_themes', array('debate_id'  =>  $id));
    $themes = array();
    foreach ($query->result_array() as $row) {
      array_push($themes, $row['theme']);
    }
    return $themes;
  }
  
  function get_followers($id) {
    $this->db->select('follower_fbid');
    $query = $this->db->get_where('debate_followers', array('debate_id'  =>  $id));
    $followers = array();
    foreach ($query->result_array() as $row) {
      array_push($followers, $row['follower_fbid']);
    }
    return $followers;
  }
  
  function get_participants($id) {
    $this->db->select('participant_fbid');
    $query = $this->db->get_where('debate_participants', array('debate_id'  =>  $id));
    $participants = array();
    foreach ($query->result_array() as $row) {
      array_push($participants, $row['participant_fbid']);
    }
    return $participants;
  }
  
  public function edit_field($id, $name, $value) {
    $data = array(
              $name   =>  $value
            );
    $this->db->where(array('id'   =>  $id));
    $this->db->update('debates', $data);
  }
  
  public function set_invites($inviter_id, $debate_id, $invites) {
    $data = array(
                  'inviter_fbid'  =>  $inviter_id,
                  'debate_id'     =>  $debate_id
                );
    
    foreach ($invites as $invite) {
      $data['invitee_fbid'] = $invite;
      $this->db->insert('invites', $data);
    }
  }
  
  public function get_debates_followed_by($follower_fbid) {
    $this->db->select('debate_id');
    $query = $this->db->get_where('debate_followers',
                                  array('follower_fbid'   =>  $follower_fbid));
    
    $debates = array();
    foreach ($query->result_array() as $row) {
      $query = $this->db->get_where('debates',
                                    array('id' =>  $row['debate_id']));
      array_push($debates, $query->row_array());
    }
    return $debates;
  }
  
  public function set_follower($id, $follower_fbid) {
    $data = array(
              'debate_id'       =>  $id,
              'follower_fbid'   =>  $follower_fbid
            );
    
    $query = $this->db->insert('debate_followers', $data);
  }
  
  public function unset_follower($id, $follower_fbid) {
    $data = array(
              'debate_id'       =>  $id,
              'follower_fbid'   =>  $follower_fbid
            );
    
    $query = $this->db->delete('debate_followers', $data);
  }
}