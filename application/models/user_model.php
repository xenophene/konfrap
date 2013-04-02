<?php

class User_model extends CI_Model {
  public function __construct() {
    $this->load->database();
  }
  
  public function get_fbid_from_uid($uid) {
    $query = $this->db->get_where('users', array('id' =>  $uid));
    $row = $query->row_array();
    if (isset($row['fbid'])) {
      return $row['fbid'];
    } else {
      return 0;
    }
  }
  
  public function get_uid_from_fbid($fbid) {
    $query = $this->db->get_where('users', array('fbid' =>  $fbid));
    $row = $query->row_array();
    if (isset($row['id'])) {
      return $row['id'];
    } else {
      return 0;
    }
  }
  
  
  public function get_users() {
    $query = $this->db->get('users');
    return $query->result_array();
  }
  
  public function get_by_url($id = null) {
    if ($id === null) {
      return array();
    }
    $query = $this->db->get_where('users', array('url'  =>  $id));
    return $query->row_array();
  }
  /**
   * Must supply an fbid. If not, redirect to user's home page
  */
  public function get_by_fbid($id = null) {
    if ($id === null) {
      return array();
    }
    $query = $this->db->get_where('users', array('fbid' => $id));
    return $query->row_array();
  }
  
  /**
   * Must supply a uid. If not, redirect to user's home page
   */
  public function get_by_uid($id = null) {
    if ($id === null) {
      return array();
    }
    $query = $this->db->get_where('users', array('id' => $id));
    return $query->row_array();
  }
  
  public function get_interests($id = null) {
    if ($id === null) {
      return array();
    }
    $query = $this->db->get_where('user_interests', array('uid' => $id));
    $interests = array();
    foreach ($query->result_array() as $row) {
      array_push($interests, $row['val']);
    }
    return $interests;
  }
  
  /**
   * Returns the followers of a user with fbid id
   */
  public function get_followers($id = null) {
    if ($id === null) {
      return array();
    }
    $query = $this->db->get_where('user_followers', array('followee' =>  $id));
    $followers = array();
    foreach ($query->result_array() as $row) {
      array_push($followers, $row['follower']);
    }
    return $followers;
  }
  
  public function set_follower($follower = null, $followee = null) {
    if ($follower === null or $followee === null) {
      return false;
    }
    $data = array(
              'follower'    =>  $follower,
              'followee'    =>  $followee
            );
    $this->db->insert('user_followers', $data);
  }
  public function unset_follower($follower = null, $followee = null) {
    $data = array(
              'follower'    =>  $follower,
              'followee'    =>  $followee
            );
    $query = $this->db->delete('user_followers', $data);
  }
  
  /**
   * Returns the followees of a user with fbid id
   */
  public function get_followees($id = null) {
    if ($id === null) {
      return array();
    }
    $query = $this->db->get_where('user_followers', array('follower' =>  $id));
    $followees = array();
    foreach ($query->result_array() as $row) {
      array_push($followees, $row['followee']);
    }
    return $followees;
  }
  /**
   * add user based on fb log in credentials
   */
  public function add_user($fb = null) {
    $this->load->helper('url');
    $this->load->helper('string');
    if ($fb === null) {
      return false;
    }
    
    $url = url_title($fb['me']['name']);
    $data = array(
      'fbid'    =>  $fb['fbid'],
      'name'    =>  $fb['me']['name'],
      'url'     =>  $url,
      'score'   =>  0
    );
    
    $query = $this->db->get_where('users', array('url'  =>  $url));
    if ($query->num_rows() > 0) {
      
      $data['url'] = random_string('alnum', 16);
      $query = $this->db->insert('users', $data);
      $id = $this->db->insert_id();
      $url = $url . '-' . $id;
      $where = array('id'  =>  $id);
      $url_data = array('url' =>  $url);
      
      $query = $this->db->update('users', $url_data, $where);
    } else {
      $query = $this->db->insert('users', $data);
      $id = $this->db->insert_id();
    }
    $data['id'] = $id;
    return $data;
  }
  
  public function set_interest($uid, $val) {
    $data = array(
              'uid'   =>  $uid,
              'val'   =>  $val
            );
    $query = $this->db->insert('user_interests', $data);
  }
  public function unset_interest($uid, $val) {
    $data = array(
              'uid'   =>  $uid,
              'val'   =>  $val
            );
    $query = $this->db->delete('user_interests', $data);
  }
  
}