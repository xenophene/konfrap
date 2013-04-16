<?php

class Comment_model extends CI_Model {
  public function __construct() {
    $this->load->database();
  }
  
  public function get_comments_from_debate_id($id) {
    $this->db->select('*');
    $this->db->from('comments');
    $this->db->where('debate_id', $id);
    $this->db->join('users', 'users.fbid = comments.author', 'left');
    $comments = $this->db->get()->result_array();
    $i = 0;
    for($i = 0; $i < sizeof($comments); $i++) {
      $comment = $comments[$i];
      $query = $this->db->get_where('comment_votes',
                                    array('comment_id'  =>  $comment['cid']));
      
      $upvoters = array();
      $downvoters = array();
      foreach ($query->result_array() as $row) {
        if ($row['vote_type'] == 1) {
          array_push($upvoters, $row['voter_fbid']);
        } else {
          array_push($downvoters, $row['voter_fbid']);
        }
      }
      $comments[$i]['upvoters'] = $upvoters;
      $comments[$i]['downvoters'] = $downvoters;
    }
    return $comments;
  }
}