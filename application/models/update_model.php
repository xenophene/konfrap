<?php

class Update_model extends CI_Model {
  public function __construct() {
    $this->load->database();
  }
	
	public function get_all(){
		$query = $this->db->get('updates');
		return $query->result_array();
	}
	
	/*Get details depending on the type of update and source/target. */
	public function get_details($type, $id, $arg){
		if($arg=="source"){
			return $this->user_model->get_by_fbid($id);
		}
		else if($arg=="target"){
			if($type==3)
				return $this->user_model->get_by_fbid($id);
			else
				return $this->debate_model->get_by_id($id);
		}
	}
		
	 /*Get the relevant updates of the user($uid : FB id)
	 */
	public function get_by_id($fbid){
		if(!$fbid)
			return null;
		else{
			$friends = $this->user_model->my_friends();
			$friends = array();
			$followers = $this->user_model->get_followers($fbid);
			
			//$sql = "select * from updates where source IN (100000901607885, 653499724)";
			$rels = "(".implode(", ", array_merge($friends, $followers)).")";
			$sql = "select * from updates where source IN ".$rels;
			$query = $this->db->query($sql);
			$result = $query->result_array();
			
			$updates = array();
			
			foreach($result as $feed){
				$type  = $feed['type'];
				
				$d2 = $this->get_details($type, $feed['source'], "source");
				$d1 = $this->get_details($type, $feed['target'], "target");
				
				$data = array(
											"source" => $d1,
											"target" =>	$d2
											);
				
				$f = array(
									 "timestamp" => $feed['timestamp'],
									 "type"	=> $feed['type'],
									 "data" => $data
									 );
				
				array_push($updates, $f);
				
			}
			return $updates;
			
		}
	}
	
	/* 'TYPE': MEANING
	 *	1: USER 'SOURCE' CREATED DEBATE 'TARGET'
	 *  2: USER 'SOURCE' FOLLOWS DEBATE 'TARGET'
	 *  3: USER 'SOURCE' FOLLOWS USER 'TARGET'
	 *  4: USER 'SOURCE' COMMENTED ON DEBATE 'TARGET'
	 */
	
	public function insert($source, $target, $type){
		$time = time();
		$data = array(
									"timestamp" => $time,
									"source" 	=> $source,
									"target"  => $target,
									"type"    => $type
									);
		$this->db->insert('updates', $data);
		$id = $this->db->insert_id();
		return $id;
		}
	
	
}
